import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, IsNumber } from 'class-validator';

export class CategoryFilterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  parentCategoryId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  current?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  pageSize?: number;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  sortDescending?: boolean;
}
