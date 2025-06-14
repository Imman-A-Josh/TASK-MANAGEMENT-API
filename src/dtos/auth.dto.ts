import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class SignupDto {

    @IsNotEmpty({ message: 'First name is required' })
    first_name!: string;

    @IsEmail({}, { message: 'Email must be valid' })
    email!: string;

    @IsNotEmpty({ message: 'Phone is required' })
    phone!: string;

    @Length(6, 20, { message: 'Password must be 6-20 characters' })
    password!: string;

    @IsNotEmpty({ message: 'Confirm password is required' })
    confirm_password!: string;
}
