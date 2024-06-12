import { CreateUserDto } from './create-user.dto';
import { OmitType } from '@nestjs/swagger';

export class RegisterUserDto extends OmitType(CreateUserDto, [
  'address',
  'phone',
  'dob',
  'roleId',
] as const) {}
