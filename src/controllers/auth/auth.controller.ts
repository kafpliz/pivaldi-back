import { Body, Controller, Get, HttpException, HttpStatus, Post, Query } from '@nestjs/common';
import { AuthForgotPasswordDTO, AuthResendDTO, AuthSetPasswordDTO, AuthSignInDTO, AuthSignUpDTO, AuthVerifyEmailDTO } from 'src/dto/auth.dto';
import { AuthService } from './auth.service';
import { isValidPhoneNumber } from 'libphonenumber-js';

@Controller('auth')
export class AuthController {

    constructor(private service: AuthService) { }

    @Post('sign-in')
    signIn(@Body() body: AuthSignInDTO) {
        const data = this.normalizedSignIn(body.login, body.password)
        console.log(data);
        return this.service.signIn(data)
    }

    @Post('sign-up')
    signUp(@Body() body: AuthSignUpDTO){
        return this.service.signUp(body)
    }

    @Post('verify')
    verifyEmail(@Body() body:AuthVerifyEmailDTO ){
        return this.service.verifyEmail(body)
    }

    @Get('forgot-password')
    forgotPassword(@Query('email') email:string){
         const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
        const isEmail = emailRegex.test(email)
        if(!isEmail){
             throw new HttpException({ success: false, message: 'Введите корректную почту!' }, HttpStatus.BAD_REQUEST)
        }
        return this.service.forgotPasswordSendCode(email)
    }
    @Post('forgot-password')
    forgotPasswordCode(@Body() body:AuthForgotPasswordDTO){
        return this.service.forgotPasswordConfirmCode(body)
    }
    @Post('forgot-password/new')
    setPassword(@Body() body:AuthSetPasswordDTO){
        return this.service.setNewPassword(body)
    }

    @Post('resend')
    resendEmailCode(@Body() body:AuthResendDTO){
        return this.service.resendCode(body)
    }


    private normalizedSignIn(login: string, password: string) {
        const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
        const isEmail = emailRegex.test(login)

        if (isEmail) {
            return {
                email: login,
                password
            };
        }

        const cleaned = login.replace(/[\s\-\(\)]/g, '').replace('+', '');
        const isPhone = isValidPhoneNumber(cleaned, 'RU');

        if (isPhone) {
            return {
                tel: cleaned,
                password
            };
        }
        throw new HttpException({succes: false, message: "Логин должен быть почтой или номером телефона"}, HttpStatus.BAD_GATEWAY)
    }
}
