import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { SettingType } from '../models/setting-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class SettingCreateDto {
  @ApiProperty({
    type: 'boolean',
    example: false,
    required: false,
  })
  @IsBoolean()
  builtin = false;

  @ApiProperty({
    example: 'siteName',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'The name of the website displayed in the title bar.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: SettingType.String,
    enum: SettingType,
  })
  @IsString()
  @IsEnum(SettingType)
  type: SettingType;

  @ApiProperty({
    example: 'My Website',
  })
  @IsString()
  defaultValue: string;

  @ApiProperty({
    example: 'My Awesome Site',
    required: false,
  })
  @IsString()
  @IsOptional()
  value?: string;
}
