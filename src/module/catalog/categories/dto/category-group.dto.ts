import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryGroupDto {
  @ApiProperty({
    example: 'Home Appliances',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
