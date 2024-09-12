import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'John' })
  firstName?: string;

  @ApiProperty({ example: '+123456789' })
  phone?: string;

  @ApiProperty({ example: '123 Main St, City' })
  address?: string;

  @ApiProperty({ example: '2024-09-10T12:34:56Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-09-10T12:34:56Z' })
  updatedAt: Date;
}
