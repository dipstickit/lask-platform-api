import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WishlistCreateDto {
  @ApiProperty({
    example: 'My Favorite Products',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: [1, 2, 3],
    type: [Number],
  })
  @IsInt({ each: true })
  productIds: number[];
}
