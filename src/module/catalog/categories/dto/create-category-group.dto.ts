import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
