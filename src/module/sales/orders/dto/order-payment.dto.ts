import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderPaymentDto {
  @ApiProperty({
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  methodId: number;

  @ApiProperty({
    example: 'Completed',
    required: false,
  })
  @IsOptional()
  paymentStatus?: string;
}
