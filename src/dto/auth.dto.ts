import { IsEmail, IsNotEmpty, IsStrongPassword, Length, Max, Min, registerDecorator, ValidationOptions } from "class-validator";
import { isValidPhoneNumber } from 'libphonenumber-js';
import { EAuthSignInDTO } from "src/shared/enum/dto.enum";

export class AuthSignInDTO {
    @IsNotEmpty({ message: EAuthSignInDTO.loginEmpty })
    @IsEmailOrPhone({ message: EAuthSignInDTO.IsEmailOrPhone })
    login!: string

    @IsNotEmpty({ message: EAuthSignInDTO.passwordEmpty })
    @IsStrongPassword({
        minLength: 6,
    }, { message: EAuthSignInDTO.strongPassword })
    password!: string

}

export class AuthSignUpDTO {

    @IsEmail({}, { message: EAuthSignInDTO.email })
    email!: string


    @IsPhone({ message: EAuthSignInDTO.tel })
    tel!: string

    @IsStrongPassword({
        minLength: 6,
        minSymbols: 1,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
    }, { message: EAuthSignInDTO.strongPassword })
    password!: string
}

export class AuthVerifyEmailDTO {

    @IsEmail({}, { message: EAuthSignInDTO.email })
    email!: string


    @Length(6)
    code!: number
}

export class AuthForgotPasswordDTO {
    @IsNotEmpty({message: EAuthSignInDTO.key})
    key!: string
    @Min(100000, { message: EAuthSignInDTO.lengthVerifyCode })
    @Max(999999, { message: EAuthSignInDTO.lengthVerifyCode })
    code!: number
}
export class AuthSetPasswordDTO {
    @IsNotEmpty({message: EAuthSignInDTO.key})
    key!: string
    @IsStrongPassword({
        minLength: 6,
        minSymbols: 1,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
    }, { message: EAuthSignInDTO.strongPassword })
    password!: string
}
export class AuthResendDTO {
    @IsEmail({},{message: EAuthSignInDTO.email})
    email!:string
}
export class AuthRefreshDTO {
    @IsNotEmpty({message: EAuthSignInDTO.empty})
    refreshToken!:string
}

export function IsEmailOrPhone(validationOptions: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'IsEmailOrPhone',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any) {
                    if (!value || typeof value !== 'string') return false;


                    const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
                    const isEmail = emailRegex.test(value);


                    const cleaned = value.replace(/[\s\-\(\)]/g, '');
                    const isPhone = isValidPhoneNumber(cleaned, 'RU');

                    return isEmail || isPhone;
                }
            }
        })
    }
}
export function IsPhone(validationOptions: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'IsPhone',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any) {
                    if (!value || typeof value !== 'string') return false;
                    const cleaned = value.replace(/[\s\-\(\)]/g, '');
                    const isPhone = isValidPhoneNumber(cleaned, 'RU');

                    return isPhone;
                }
            }
        })
    }
}
