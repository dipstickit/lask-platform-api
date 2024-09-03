import {
  IsInt,
  IsISO31661Alpha2,
  IsNotEmpty,
  IsOptional,
  IsPostalCode,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderDeliveryDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the delivery method being used',
  })
  @IsInt()
  @IsNotEmpty()
  methodId: number;

  @ApiProperty({
    example: 'In Progress',
    required: false,
    description: 'The current status of the delivery',
  })
  @IsOptional()
  @IsString()
  deliveryStatus?: string;

  @ApiProperty({
    example: '123 Main St',
    description: 'The delivery address',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    example: 'New York',
    description: 'The city for the delivery address',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    example: '10001',
    required: false,
    description: 'The postal code for the delivery address',
  })
  @IsOptional()
  @IsString()
  @IsPostalCode('any')
  postalCode?: string;

  @ApiProperty({
    example: 'US',
    description: 'The country code for the delivery address',
  })
  @IsString()
  @IsNotEmpty()
  @IsISO31661Alpha2()
  country: string;
}
