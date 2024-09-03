import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CategoryGroupDto } from './category-group.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryUpdateDto {
  @ApiProperty({
    example: 'Updated Electronics',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'Updated description for the category',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'updated-electronics',
    required: false,
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    example: 2,
    required: false,
  })
  @IsOptional()
  parentCategoryId?: number;

  @ApiProperty({
    type: [CategoryGroupDto],
    example: [{ name: 'Updated Group 1' }, { name: 'Updated Group 2' }],
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @IsNotEmptyObject({ nullable: false }, { each: true })
  @Type(() => CategoryGroupDto)
  groups?: CategoryGroupDto[];
}
