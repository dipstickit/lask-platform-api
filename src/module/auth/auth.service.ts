import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { User } from '../users/models/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterResponseDto } from './dto/register-response.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  createRefreshToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      iss: 'from nest server',
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_KEY'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRE'),
    });
  }

  async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
    const hashedPassword = await argon2.hash(registerDto.password);

    const user = await this.usersService.addUser({
      ...registerDto,
      password: hashedPassword,
    });
    return {
      email: user.email,
      firstName: user.firstName,
      phone: user.phone,
      address: user.address,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async validateUser(loginDto: LoginDto): Promise<User | null> {
    const user = await this.usersService.findUserToLogin(loginDto.email);
    if (user && (await argon2.verify(user.password, loginDto.password))) {
      return user;
    }
    return null;
  }

  async login(user: User): Promise<LoginResponseDto> {
    const { email, id, role, firstName } = user;
    const payload = { email, firstName, sub: id, role };
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRE'),
      }),
      this.createRefreshToken(user),
    ]);
    await this.usersService.saveRefreshToken(id, refresh_token);
    return { access_token, refresh_token };
  }

  async refresh(refreshToken: string): Promise<{ access_token: string }> {
    const payload = this.jwtService.verify(refreshToken, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_KEY'),
    });

    const new_access_token = this.jwtService.sign(
      {
        email: payload.email,
        sub: payload.sub,
        role: payload.role,
        firstName: payload.firstName,
      },
      { expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRE') },
    );

    return {
      access_token: new_access_token,
    };
  }

  async processNewToken(refreshToken: string) {
    try {
      this.logger.log(`Received refresh token: ${refreshToken}`);

      if (!refreshToken) {
        throw new BadRequestException('Refresh token must be provided');
      }

      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_KEY'),
      });

      const user = await this.usersService.findOneByToken(refreshToken);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const new_access_token = this.jwtService.sign(
        {
          email: user.email,
          sub: user.id,
          role: user.role,
          firstName: user.firstName,
        },
        {
          expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRE'),
        },
      );

      return { access_token: new_access_token };
    } catch (error) {
      this.logger.error('Failed to refresh token', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
