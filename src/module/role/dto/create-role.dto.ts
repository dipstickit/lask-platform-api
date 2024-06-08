import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, Length } from "class-validator";

export class CreateRoleDto {
    @IsNotEmpty()
    @ApiProperty({
        example: 'USER',
        default: null,
        type: String,
    })
    name: string;

    @IsOptional()
    @ApiProperty({
        example: 'Role of a User',
        default: null,
    })
    @Length(5, undefined)
    description: string;
}
