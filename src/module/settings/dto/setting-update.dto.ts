import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SettingUpdateDto {
  @ApiProperty({
    example: 'Updated Value',
  })
  @IsString()
  value: string;
}
