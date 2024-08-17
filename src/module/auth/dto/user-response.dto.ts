import { Role } from 'src/module/users/models/role.enum';

export class UserResponseDto {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  registered: Date;
  role: Role;
}
