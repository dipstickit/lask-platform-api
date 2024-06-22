import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsNotEmpty()
  @Transform(({ value }) => {
    if (typeof value === 'number' || (typeof value === 'string' && value))
      return Number(value);
    else return '';
  })
  @IsNumber()
  categoryGroupId?: number;
}
