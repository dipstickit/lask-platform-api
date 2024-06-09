import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, Length } from "class-validator";

export class CreateRoleDto {
    @IsNotEmpty()
    @ApiProperty({
        example: 'USER',
        default: null,
        type: String,
    })
    roleName: string;

    @IsOptional()
    @ApiProperty({
        example: 'Role of a User',
        default: null,
    })
    description: string;
}
