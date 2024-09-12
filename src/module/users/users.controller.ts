import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from './models/role.enum';
import { User } from './models/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserUpdateDto } from './dto/user-update.dto';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  async getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }

  @Get('/:id')
  @Roles(Role.Customer)
  @UseGuards(JwtAuthGuard)
  async getUser(@Param('id') id: number): Promise<User> {
    return await this.usersService.getUser(id);
  }

  @Patch('/:id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('id') id: number,
    @Body() update: UserUpdateDto,
  ): Promise<User> {
    return await this.usersService.updateUser(id, update);
  }

  @Delete('/:id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('id') id: number): Promise<void> {
    await this.usersService.deleteUser(id);
  }
}
