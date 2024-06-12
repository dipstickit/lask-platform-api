import {
    IsDateString,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    Matches,
    MaxLength,
    MinLength,
    IsNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { INVALID_EMAIL, INVALID_PASSWORD } from 'src/utils/message';

const passwordFormat =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

export class CreateUserDto {
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsEmail({}, { message: INVALID_EMAIL })
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @MinLength(5)
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
    userImg?: string;

    @IsOptional()
    @IsDateString()
    dob?: string;

    @IsNotEmpty()
    @Transform(({ value }) => {
        if (typeof value === 'number' || (typeof value === 'string' && value))
            return Number(value);
        else return '';
    })

    @IsNumber()
    roleId?: number;
}
