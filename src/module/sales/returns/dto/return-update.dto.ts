import { OmitType, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReturnStatus } from '../models/return-status.enum';
import { ReturnCreateDto } from './return-create.dto';

export class ReturnUpdateDto extends PartialType(
  OmitType(ReturnCreateDto, ['orderId'] as const),
) {
  @IsString()
  @IsOptional()
  @IsEnum(ReturnStatus)
  status?: ReturnStatus;
}
