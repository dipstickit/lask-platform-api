import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PageGroupDto {
  @ApiProperty({
    example: 'Main Pages',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
