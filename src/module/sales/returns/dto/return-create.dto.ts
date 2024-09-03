import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReturnCreateDto {
  @ApiProperty({
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  orderId: number;

  @ApiProperty({
    example: 'I would like to return this item because it is defective.',
  })
  @IsString()
  message: string;
}
