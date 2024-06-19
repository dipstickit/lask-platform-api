import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import {
  IsNotEmpty,
  IsOptional,
  ValidateNested,
  IsNotEmptyObject,
} from 'class-validator';
import { Type } from 'class-transformer';
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsOptional()
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @IsNotEmptyObject({ nullable: false }, { each: true })
  @Type(() => CreateCategoryDto)
  groups?: CreateCategoryDto[];
}
