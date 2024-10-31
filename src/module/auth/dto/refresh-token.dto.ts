import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'string' })
  refresh_token: string;
}
