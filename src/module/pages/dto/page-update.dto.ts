import { PageCreateDto } from './page-create.dto';
import { PageGroupDto } from './page-group.dto';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class PageUpdateDto extends PartialType(PageCreateDto) {
  @ApiProperty({
    type: [PageGroupDto],
    example: [{ name: 'Main Pages' }],
    required: false,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PageGroupDto)
  groups?: PageGroupDto[];
}
