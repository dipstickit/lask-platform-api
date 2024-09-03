import { IsNotEmpty, IsNotEmptyObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CartItemDto } from './cart-item.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CartDto {
  @ApiProperty({
    type: [CartItemDto],
    example: [
      { productId: 101, quantity: 2 },
      { productId: 102, quantity: 1 },
    ],
  })
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @IsNotEmptyObject({ nullable: false }, { each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}
