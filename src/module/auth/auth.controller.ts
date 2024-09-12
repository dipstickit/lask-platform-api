import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/models/user.entity';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { ResponseMessage } from 'src/decorator/customize';
import { LOGIN_SUCCESS } from 'src/utils/message';
import { LoginResponseDto } from './dto/login-response.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Public } from './decorators/public.decorator';
import { RegisterResponseDto } from './dto/register-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(registerDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ResponseMessage(LOGIN_SUCCESS)
  @ApiBody({ type: LoginDto })
  async login(@Req() req: Request & { user: User }): Promise<LoginResponseDto> {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('refresh')
  @ApiBody({ type: RefreshTokenDto })
  async refreshToken(@Body('refresh_token') refreshToken: string) {
    return this.authService.processNewToken(refreshToken);
  }
  @Public()
  @Post('profile')
  async getProfile(@Req() req: Request & { user: User }) {
    return req.user;
  }
}
