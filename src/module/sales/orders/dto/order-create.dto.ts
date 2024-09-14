import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  ValidateNested,
  IsNotEmptyObject,
  IsOptional,
  Matches,
} from 'class-validator';
import { OrderItemDto } from './order-item.dto';
import { OrderDeliveryDto } from './order-delivery.dto';
import { OrderPaymentDto } from './order-payment.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OrderCreateDto {
  @ApiProperty({
    example: [{ productId: 1, quantity: 2 }],
  })
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @IsNotEmptyObject({ nullable: false }, { each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  contactEmail: string;

  // @ApiProperty({ example: '+123456789' })
  // @Matches(/^\d{10,11}$/, {
  //   message: 'contactPhone must be a valid phone number',
  // }) // Cho phép 10-11 số
  // @IsPhoneNumber(null)
  // @IsNotEmpty()
  // contactPhone: string;

  @ApiProperty({
    example: 'Please leave the package at the front door',
    required: false,
  })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({
    type: OrderDeliveryDto,
    example: { method: 'Express', address: '123 Main St' },
  })
  @IsNotEmpty()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => OrderDeliveryDto)
  delivery: OrderDeliveryDto;

  @ApiProperty({
    type: OrderPaymentDto,
    example: { method: 'Credit Card', status: 'Pending' },
  })
  @IsNotEmpty()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => OrderPaymentDto)
  payment: OrderPaymentDto;
}
