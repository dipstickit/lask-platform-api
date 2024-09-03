import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PageCreateDto {
  @ApiProperty({
    example: 'About Us',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'about-us',
    required: false,
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    example: '<p>This is the content of the page.</p>',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
