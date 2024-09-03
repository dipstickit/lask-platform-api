import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductCreateDto {
  @ApiProperty({
    example: 'Smartphone',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 299.99,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  visible?: boolean;

  @ApiProperty({
    example: 'A high-end smartphone with a 6.5-inch display and 128GB storage.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 50,
  })
  @IsNumber()
  @Min(0)
  stock: number;
}
