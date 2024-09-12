import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from '../models/role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UserUpdateDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: '+841234567890', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: '123 Main St, Anytown, USA', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
