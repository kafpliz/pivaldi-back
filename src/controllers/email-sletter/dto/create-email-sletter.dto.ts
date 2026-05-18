import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateEmailSletterHrDto {
    @IsNotEmpty()
    @IsString()
    phone!: string

    @IsNotEmpty()
    @IsString()
    name!: string

    @IsNotEmpty()
    @IsString()
    resto!: string

    @IsNotEmpty()
    @IsString()
    @IsIn([ 'hr'])
    type!:  'hr'
}
export class CreateEmailSletterFrDto {
    @IsNotEmpty()
    @IsString()
    phone!: string

    @IsNotEmpty()
    @IsString()
    name!: string
    @IsNotEmpty()
    @IsString()
    lastName!: string

    @IsNotEmpty()
    @IsString()
    email!: string
    @IsNotEmpty()
    @IsString()
    city!: string

    @IsNotEmpty()
    @IsString()
    @IsIn(['fr',])
    type!: 'fr' 
}
