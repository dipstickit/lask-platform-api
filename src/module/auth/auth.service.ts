import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { User } from '../users/models/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { Role } from '../users/models/role.enum';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private config: ConfigService,
  ) {}

  async onModuleInit() {
    await this.addAdminUser();
  }

  private async addAdminUser(): Promise<void> {
    const email = this.config.get<string>('admin.email', '');
    const password = this.config.get<string>('admin.password', '');

    if (!email || !password) {
      this.logger.warn('Admin email or password not provided.');
      return;
    }

    try {
      const user = await this.register({ email, password });
      await this.usersService.updateUser(user.id, { role: Role.Admin });
    } catch (error) {
      this.logger.error('Failed to add admin user', error.stack);
    }
  }

  async register(registerDto: RegisterDto): Promise<User> {
    const hashedPassword = await argon2.hash(registerDto.password);
    return this.usersService.addUser(
      registerDto.email,
      hashedPassword,
      registerDto.firstName,
      registerDto.lastName,
    );
  }

  async validateUser(loginDto: LoginDto): Promise<User | null> {
    const user = await this.usersService.findUserToLogin(loginDto.email);
    if (user && (await argon2.verify(user.password, loginDto.password))) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    }
    return null;
  }
}
