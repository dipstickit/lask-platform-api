import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductRatingDto {
  @ApiProperty({
    example: 4.5,
  })
  @IsNumber()
  @IsPositive()
  @Max(5)
  rating: number;

  @ApiProperty({
    example: 'Great product! Highly recommend.',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
