import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, Req } from '@nestjs/common';
import { AuthForgotPasswordDTO, AuthRefreshDTO, AuthResendDTO, AuthSetPasswordDTO, AuthSignInDTO, AuthSignUpDTO, AuthVerifyEmailDTO } from 'src/dto/auth.dto';
import { AuthService } from './auth.service';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { Public } from 'src/shared/decorators/public.decorator';

@Controller('auth')

export class AuthController {

    constructor(private service: AuthService) { }

    @Public()
    @Post('sign-in')
    signIn(@Body() body: AuthSignInDTO) {
        const data = this.normalizedSignIn(body.login, body.password)
        console.log(data);
        return this.service.signIn(data)
    }

    @Public()
    @Post('sign-up')
    signUp(@Body() body: AuthSignUpDTO){
        const data = this.normalizedSignUp(body.email, body.tel, body.password, body.name, body.lastName)

        return this.service.signUp(data)
    }

    @Public()
    @Post('verify')
    verifyEmail(@Body() body:AuthVerifyEmailDTO ){
        return this.service.verifyEmail(body)
    }

    @Public()
    @Get('forgot-password')
    forgotPassword(@Query('email') email:string){
         const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
        const isEmail = emailRegex.test(email)
        if(!isEmail){
             throw new HttpException({ success: false, message: 'Введите корректную почту!' }, HttpStatus.BAD_REQUEST)
        }
        return this.service.forgotPasswordSendCode(email)
    }

    @Public()
    @Post('forgot-password')
    forgotPasswordCode(@Body() body:AuthForgotPasswordDTO){
        return this.service.forgotPasswordConfirmCode(body)
    }

    @Public()
    @Post('forgot-password/new')
    setPassword(@Body() body:AuthSetPasswordDTO){
        return this.service.setNewPassword(body)
    }

    @Public()
    @Post('resend')
    resendEmailCode(@Body() body:AuthResendDTO){
        return this.service.resendCode(body)
    }

    @Public()
    @Post('refresh')
    refresh(@Body() body:AuthRefreshDTO){
        return this.service.refreshTokens(body.refreshToken)
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
    private normalizedSignUp(email: string,tel:string, password: string,name:string, lastName:string,) {
    

        const cleaned = tel.replace(/[\s\-\(\)]/g, '').replace('+', '');

        if (cleaned) {
            return {
                tel: cleaned,
                email,
                password,name,lastName
            };
        }
        throw new HttpException({succes: false, message: "Ошибка при нормализации данных."}, HttpStatus.BAD_GATEWAY)
    }
}
