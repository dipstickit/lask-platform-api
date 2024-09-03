import { DataType } from '../models/data-type.enum';
import { ArrayNotEmpty, IsArray, IsEnum, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExportDto {
  @ApiProperty({
    example: [DataType.Users, DataType.Products],
    isArray: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(DataType, { each: true })
  data: DataType[];

  @ApiProperty({
    example: 'json',
    enum: ['json', 'csv'],
  })
  @IsIn(['json', 'csv'])
  format: 'json' | 'csv';
}
