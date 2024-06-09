import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import {
  DUPLICATED_ROLE,
  FAIL_CREATE_ROLE,
  FAIL_LOAD_ROLE,
  NOTFOUND_ROLE
} from 'src/utils/message';
@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) { }
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const existingRole = await this.roleRepository.findOne({ where: { roleName: createRoleDto.roleName } })
    if (existingRole) {
      throw new BadRequestException(DUPLICATED_ROLE)
    }
    const createdRole = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(createdRole);
  }

  async findAll(): Promise<Role[]> {
    try {
      return await this.roleRepository.find({
        order: {
          id: 'ASC',
        },
      });
    } catch (error) {
      throw new BadRequestException(FAIL_LOAD_ROLE);
    }
  }


  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new BadRequestException(NOTFOUND_ROLE)
    }
    return role;
  }

  async findOneByName(name: string): Promise<Role> {
    const role = await this.roleRepository.createQueryBuilder('role').where('role.roleName = :name', { name }).getOne();
    if (!role) {
      throw new BadRequestException(FAIL_LOAD_ROLE)
    }
    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new BadRequestException(FAIL_LOAD_ROLE)
    }
    const updatedRole = this.roleRepository.merge(role, updateRoleDto);
    if (!updatedRole) {
      throw new BadRequestException(FAIL_CREATE_ROLE)

    }
    return this.roleRepository.save(updatedRole);

  }

  async remove(id: number): Promise<void> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new BadRequestException(NOTFOUND_ROLE)
    }
    await this.roleRepository.delete({ id });
  }
}
