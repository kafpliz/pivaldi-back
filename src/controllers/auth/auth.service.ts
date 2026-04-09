import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma/prisma.service';
import { IAuthForgorPasswordReq, IAuthNewPasswordReq, IAuthResendReq, IAuthSignInReq, IAuthSignUpReq, IAuthVerifyCodeReq } from 'src/shared/interfaces/auth.interface';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/service/email/email.service';
import { use } from 'passport';
import { randomUUID } from 'crypto';



@Injectable()
export class AuthService {
    private readonly SALT_ROUNDS = 12;
  
    
    constructor(private prisma: PrismaService, private jwt: JwtService, private email: EmailService) { }

    async signIn(data: IAuthSignInReq) {
        if (!data.email && !data.tel) {
            throw new HttpException({ success: false, message: 'Укажите почту или телефон' }, HttpStatus.BAD_REQUEST)
        }
        console.log('in',Date.now() + (3 * 60 * 60 * 1000));
        
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: data.email },
                    { tel: data.tel }
                ]
            }
        })
        if (!user) {
            throw new HttpException({ success: false, message: 'Такого пользователя не существует, пройдите регистрацию!' }, HttpStatus.UNAUTHORIZED)
        }

        if (user.confirmEmail == false) {
            throw new HttpException({ success: false, message: 'Подтвердите почту!' }, HttpStatus.UNAUTHORIZED)
        }

        const isPasswordValid = await this.comparePass(data.password, user.password)

        if (!isPasswordValid) {
            throw new HttpException({ success: false, message: 'Не верный пароль!' }, HttpStatus.UNAUTHORIZED)
        }
        const tokens = await this.generateTokens(user.id, user.email || user.tel,)
        await this.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken
            }
        })

        return {
            success: true,
            message: 'Вход выполнен успешно',
            tokens
        }
    }

    async signUp(data: IAuthSignUpReq) {

        if (!data.email && !data.tel) {
            throw new HttpException({ success: false, message: 'Укажите почту или телефон' }, HttpStatus.BAD_REQUEST)
        }

        const candidate = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: data.email },
                    { tel: data.tel }
                ]
            }
        })
        if (candidate) {
            throw new HttpException({ success: false, message: 'Такой пользователь уже существует' }, HttpStatus.BAD_REQUEST)
        }
        let hashedPassword: string;

        try {
            hashedPassword = await bcrypt.hash(data.password, this.SALT_ROUNDS)
        } catch (error) {
            throw new HttpException({ success: false, message: 'Ошибка сервера' }, HttpStatus.BAD_GATEWAY)
        }

        const userData: any = {
            password: hashedPassword,
        };


        userData.email = data.email;
        userData.tel = data.tel.replace('+', '').replace(/[\s\-\(\)]/g, '');
        console.log(userData.tel);

        const code = this.email.generateCode()
        const experiesCode = Date.now() + (3 * 60 * 60 * 1000);
        try {
            await this.email.sendVerifivicationCode(data.email, code)

            userData['emailCode'] = code
            userData['emailCodeExpiries'] = experiesCode
        } catch (error) {
            throw new HttpException({ success: false, message: 'Ошибка сервера' }, HttpStatus.BAD_GATEWAY)
        }


        await this.prisma.user.create({
            data: userData
        })

        return {
            success: true,
            message: `Подтвердите ${data.email ? 'почту' : 'номер телефона'}. Введи код отправленный вам на устройство. `,
        };
    }

    async verifyEmail(data: IAuthVerifyCodeReq) {
        const user = await this.prisma.user.findFirst({
            where: {
                email: data.email
            }
        })

        if (!user) {
            throw new HttpException({ success: false, message: 'Такого пользователя не существует!' }, HttpStatus.BAD_REQUEST)
        }


        if (user.emailCodeExpiries && user.emailCodeExpiries < Date.now()) {
            throw new HttpException({ success: false, message: 'Срок действия кода уже истёк, получите новый!' }, HttpStatus.BAD_REQUEST)
        }

        if (user.emailCode != data.code) {
            throw new HttpException({ success: false, message: 'Неверный код подверждения!' }, HttpStatus.BAD_REQUEST)
        } else {
            await this.prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    confirmEmail: true,

                }
            })

            return {
                success: true,
                message: 'Успешно! Осталось только войти в аккаунт!'
            }
        }


    }


    async forgotPasswordSendCode(data: string) {
        const user = await this.prisma.user.findFirst({
            where: {
                email: data
            }
        })
        if (!user) {
            throw new HttpException({ success: false, message: 'Такого пользователя не существует!' }, HttpStatus.UNAUTHORIZED)
        }
        const code = this.email.generateCode()
        try {
            const key = randomUUID()
            const time = Date.now() + (3 * 60 * 60 * 1000);
            await this.email.sendVerifivicationCode(data, code)
            await this.prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    private_key: key,
                    emailCode: code,
                    emailCodeExpiries: time
                }
            })

            return {
                success: true,
                message: 'Проверьте свою почту!',
                key
            }

        } catch (error) {
            throw new HttpException({ success: false, error }, HttpStatus.BAD_GATEWAY)
        }
    }

    async forgotPasswordConfirmCode(data: IAuthForgorPasswordReq) {
        const user = await this.prisma.user.findFirst({
            where: {
                private_key: data.key
            }
        })

        if (!user) {
            throw new HttpException({ success: false, message: 'Такого пользователя не существует!' }, HttpStatus.UNAUTHORIZED)
        }
        if (user.emailCodeExpiries && user.emailCodeExpiries < Date.now()) {
            throw new HttpException({ success: false, message: 'Срок действия кода уже истёк, получите новый!' }, HttpStatus.BAD_REQUEST)
        }

        if (user.emailCode != data.code) {
            throw new HttpException({ success: false, message: 'Неверный код подверждения!' }, HttpStatus.BAD_REQUEST)
        }

        if (user.emailCode == data.code) {
            await this.prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    canChangePass: true
                }
            })
            return {
                success: true, message: 'Введите новый пароль!', key: data.key
            }
        }

    }

    async setNewPassword(data: IAuthNewPasswordReq) {
        const user = await this.prisma.user.findFirst({
            where: {
                private_key: data.key
            }
        })

        if (!user) {
            throw new HttpException({ success: false, message: 'Такого пользователя не существует!' }, HttpStatus.UNAUTHORIZED)
        }
        if (!user.canChangePass) {
            throw new HttpException({ success: false, message: 'Доступ запрещён!' }, HttpStatus.UNAUTHORIZED)
        }
        let hashedPassword: string;

        try {
            hashedPassword = await bcrypt.hash(data.password, this.SALT_ROUNDS)
        } catch (error) {
            throw new HttpException({ success: false, message: 'Ошибка сервера' }, HttpStatus.BAD_GATEWAY)
        }

        const tokens = await this.generateTokens(user.id, user.email)
        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: hashedPassword,
                refreshToken: tokens.refreshToken,
                accessToken: tokens.accessToken,
                canChangePass: false,
            }
        })

        return { 
            success: true, message: 'Успешно!',
            tokens 
        }

    }

    async resendCode(data:IAuthResendReq){
       
        
          const user = await this.prisma.user.findFirst({
            where: {
                email: data.email
            }
        })

        if (!user) {
            throw new HttpException({ success: false, message: 'Такого пользователя не существует!' }, HttpStatus.BAD_REQUEST)
        }
        const code = this.email.generateCode()
        try {
        const exp = Date.now() + (3 * 60 * 60 * 1000)
        console.log(exp);
        
        await this.email.sendVerifivicationCode(data.email, code)
        await this.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                emailCodeExpiries: exp,
                emailCode: code
            }
        })

        return { success: true, message: 'Успешно!' }
        } catch (error) {
             throw new HttpException({ success: false, message: 'Ошибка сервера' }, HttpStatus.BAD_GATEWAY)
        }

    }

    async refreshTokens(refreshToken: string) {
        if (!refreshToken) {
            throw new HttpException({ success: false, message: 'Refresh Token отсутсвует' }, HttpStatus.BAD_REQUEST)
        }

        try {
            const paylaod = this.jwt.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET
            })

            const user = await this.prisma.user.findUnique({
                where: { id: paylaod.sub }
            })

            if (!user || user.refreshToken !== refreshToken) {
                throw new HttpException({ success: false, message: 'Недействительный refresh token' }, HttpStatus.UNAUTHORIZED)
            }
            const newTokens = await this.generateTokens(user.id, user.email || user.tel);

            await this.prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    accessToken: newTokens.accessToken,
                    refreshToken: newTokens.refreshToken
                }
            })
            return newTokens

        } catch (error) {
            throw new HttpException({ success: false, message: 'Недействительный refresh' }, HttpStatus.UNAUTHORIZED)
        }

    }

    async logOut(userId: number) {
        await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                refreshToken: null,
                accessToken: null
            }
        })
    }




    private async generateTokens(userId: number, login: string | null) {
        const payload = { sub: userId, login }

        const accessToken = this.jwt.sign(payload)


        const refreshToken = this.jwt.sign(
            { sub: userId },
            { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '30d' }
        )
        return { accessToken, refreshToken }
    }

    private async comparePass(pass: string, hashedPass: string): Promise<boolean> {
        const isMatch = await bcrypt.compare(pass, hashedPass);
        return isMatch;
    }




}
