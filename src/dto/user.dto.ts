import { registerDecorator, ValidationOptions } from "class-validator";
import profanityList from '../shared/utils/profanity.json'
import { EUserUpdDataDTO } from "src/shared/enum/dto.enum";
import { isValidPhoneNumber } from "libphonenumber-js";

export  class UserUpdDataDTO {

    @IsNotProfanity({message: EUserUpdDataDTO.isNotProfanity})
    name?:string

    @IsNotProfanity({message: EUserUpdDataDTO.isNotProfanity})
    lastName?:string

    @IsPhone({message: EUserUpdDataDTO.isPhone})
    tel?:string
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
                    if(value == undefined) return true
                    if (!value || typeof value !== 'string' ) return false;
                    const cleaned = value.replace(/[\s\-\(\)]/g, '');
                    const isPhone = isValidPhoneNumber(cleaned, 'RU');

                    return isPhone;
                }
            }
        })
    }
}

export function IsNotProfanity(validationOptions: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'isNotProfanity',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value, validationArguments) {
                 
                    if (typeof value !== 'string' || value.length == 0) return true;
                    const lowerValue = value.toLowerCase();
       
                    return !profanityList.some(profaneWord =>
                        lowerValue.includes(profaneWord.toLowerCase())
                    );
                },
            }
            })
    }
}