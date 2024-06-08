import {
    IsDateString,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    Matches,
    MaxLength,
    MinLength,
    IsNumber,
    IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { INVALID_EMAIL, INVALID_PASSWORD } from 'src/utils/message';
import { Role } from '../enum/role.enum';

const passwordFormat =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

export class CreateUserDto {
    @IsNotEmpty()
    firstname: string;

    @IsNotEmpty()
    lastname: string;

    @IsEmail({}, { message: INVALID_EMAIL })
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(20)
    @Matches(passwordFormat, {
        message: INVALID_PASSWORD,
    })
    password: string;

    @IsOptional()
    address?: string;

    @IsOptional()
    phone?: string;

    @IsOptional()
    @IsDateString()
    dob?: string;

    @IsNotEmpty()
    @Transform(({ value }) => {
        if (typeof value === 'number' || (typeof value === 'string' && value))
            return Number(value);
        else return '';
    })

    @IsEnum(Role)
    roleId: Role;
}
