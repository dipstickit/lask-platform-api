import { PartialType } from '@nestjs/swagger';
import { OrderCreateDto } from './order-create.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '../models/order-status.enum';

export class OrderUpdateDto extends PartialType(OrderCreateDto) {
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;
}
