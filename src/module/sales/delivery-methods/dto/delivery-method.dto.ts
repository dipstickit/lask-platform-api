import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeliveryMethodDto {
  @ApiProperty({
    example: 'Express Delivery',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Fast delivery within 1-2 business days',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 9.99,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;
}
