import { IsBooleanString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ImportDto {
  @ApiProperty({
    example: 'true',
    required: false,
  })
  @IsBooleanString()
  @IsOptional()
  clear?: string;

  @ApiProperty({
    example: 'false',
    required: false,
  })
  @IsBooleanString()
  @IsOptional()
  noImport?: string;
}
