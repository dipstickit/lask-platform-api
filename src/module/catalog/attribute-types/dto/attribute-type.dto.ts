import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AttributeValueType } from '../models/attribute-value-type.enum';

export class AttributeTypeDto {
  @ApiProperty({
    example: 'Size',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: AttributeValueType.String,
    enum: AttributeValueType,
    description: 'The type of value this attribute will hold',
  })
  @IsString()
  @IsEnum(AttributeValueType)
  valueType: AttributeValueType;
}
