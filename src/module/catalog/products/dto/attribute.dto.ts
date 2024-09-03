import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AttributeDto {
  @ApiProperty({
    example: 'Color',
  })
  @IsString()
  value: string;

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  typeId: number;
}
