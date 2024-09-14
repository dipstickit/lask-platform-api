import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './models/user.entity';
import { UserUpdateDto } from './dto/user-update.dto';
import { NotFoundError } from '../errors/not-found.error';
import { ConflictError } from '../errors/conflict.error';
import { IUser } from './interface/User';
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async addUser(createUserInput: Partial<IUser>): Promise<User> {
    try {
      const user = this.usersRepository.create(createUserInput);
      const savedUser = await this.usersRepository.save(user);
      const { password, ...toReturn } = savedUser;
      return toReturn as User;
    } catch (error) {
      throw new ConflictError('user', 'email', createUserInput.email!);
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { email },
    });
  }

  async findUserToLogin(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { email },
      select: {
        password: true,
        email: true,
        id: true,
        role: true,
        firstName: true,
      },
    });
  }

  async findUserToSession(id: number): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { id },
      select: { email: true, id: true, role: true },
    });
  }

  async getUsers(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async getUser(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundError('user', 'id', id.toString());
    }
    return user;
  }

  async updateUser(id: number, update: UserUpdateDto): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundError('user', 'id', id.toString());
    }
    Object.assign(user, update);
    await this.usersRepository.save(user);
    return user;
  }

  async deleteUser(id: number): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundError('user', 'id', id.toString());
    }
    await this.usersRepository.delete({ id });
    return true;
  }

  async findOneByToken(refreshToken: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { refreshToken },
    });

    return user || null;
  }

  async saveRefreshToken(userId: number, refreshToken: string): Promise<void> {
    await this.usersRepository.update(userId, { refreshToken });
  }
}
