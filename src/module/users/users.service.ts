import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { genSalt, hash } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { IsNull, Not, Repository } from 'typeorm';
import {
  CONFLICT_EMAIL,
  NOTFOUND_USER,
  NOTFOUND_ROLE,
} from 'src/utils/message';
import { RoleService } from '../role/role.service';
import { UserFilterDto } from './dto/filter-user.dto';
export const hashPassword = async (password: string) => {
  const salt = await genSalt(10);
  const hashPW = await hash(password, salt);
  return hashPW;
};
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly roleService: RoleService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const { email, roleId, password } = createUserDto;

    const userExist = await this.usersRepository.findOneBy({ email });
    if (userExist) {
      throw new BadRequestException(CONFLICT_EMAIL);
    }

    const role = await this.roleService.findOneById(roleId);
    if (!role) {
      throw new BadRequestException(NOTFOUND_ROLE);
    }

    const hashPW = await hashPassword(password);

    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashPW,
      role,
    });

    const result = await this.usersRepository.save(newUser);

    return result;
  }

  async findAll(queryObj: UserFilterDto = {}) {
    const {
      firstName,
      email,
      phone,
      roleId,
      isActive,
      sortBy,
      sortDescending,
      pageSize,
      current,
    } = queryObj;

    const defaultLimit = pageSize ? pageSize : 10;
    const defaultPage = current ? current : 1;
    const offset = (defaultPage - 1) * defaultLimit;

    const query = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role');

    // Apply filters
    if (firstName) {
      query.andWhere('user.firstName ILike :firstName', {
        firstName: `%${firstName}%`,
      });
    }
    if (email) {
      query.andWhere('user.email ILike :email', { email: `%${email}%` });
    }
    if (phone) {
      query.andWhere('user.phone ILike :phone', { phone: `%${phone}%` });
    }
    if (typeof isActive === 'boolean') {
      query.andWhere('user.isActive = :isActive', { isActive });
    }
    if (roleId) {
      query.andWhere('role.id = :roleId', { roleId });
    }

    // Sorting logic
    const sortableCriterias = ['firstName', 'email', 'dob'];
    if (sortableCriterias.includes(sortBy)) {
      query.orderBy(`user.${sortBy}`, sortDescending ? 'DESC' : 'ASC');
    }

    const [result, totalItems] = await query
      .skip(offset)
      .take(defaultLimit)
      .getManyAndCount();

    const totalPages = Math.ceil(totalItems / defaultLimit);

    const data = result.map((user) => ({
      ...user,
      role: user.role.roleName,
    }));

    return {
      currentPage: defaultPage,
      totalPages,
      pageSize: defaultLimit,
      totalItems,
      items: data,
    };
  }

  async findOneById(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!user) {
      throw new BadRequestException(NOTFOUND_USER);
    }
    return {
      ...user,
      role: user.role.roleName,
    };
  }

  async findOneByToken(refreshToken: string) {
    return this.usersRepository.findOneBy({ refreshToken });
  }

  async findOneByEmail(email: string) {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();

    if (!user) {
      throw new BadRequestException(NOTFOUND_USER);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { email, password, roleId, ...rest } = updateUserDto;
    let hashPW = '';

    const user = await this.usersRepository.findOneBy({ email });
    if (user && user.id !== id) throw new BadRequestException(CONFLICT_EMAIL);

    const role = await this.roleService.findOneById(roleId);
    if (!role) throw new BadRequestException(NOTFOUND_ROLE);
    if (password) {
      hashPW = await hashPassword(password);
    }

    const existUser = await this.usersRepository.existsBy({ id });
    if (!existUser) throw new BadRequestException(NOTFOUND_USER);

    return this.usersRepository.update(id, {
      email,
      role,
      password: hashPW,
      ...rest,
    });
  }

  async remove(id: number) {
    const existUser = await this.usersRepository.findOne({ where: { id } });
    if (!existUser) throw new BadRequestException(NOTFOUND_USER);

    existUser.isActive = false;
    existUser.deletedAt = new Date();
    await this.usersRepository.save(existUser);
    return existUser;
  }

  async restore(id: number) {
    const existUser = await this.usersRepository.findOne({
      where: { id, deletedAt: Not(IsNull()) },
      withDeleted: true, // Thêm điều kiện này
    });
    if (!existUser) throw new BadRequestException(NOTFOUND_USER);

    existUser.isActive = true;
    existUser.deletedAt = null; // Reset thời gian xóa
    await this.usersRepository.save(existUser);
    return existUser;
  }
}
