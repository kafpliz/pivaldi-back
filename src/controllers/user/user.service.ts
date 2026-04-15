import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma/prisma.service';
import { IUserUpdProc } from 'src/shared/interfaces/user.interface';


@Injectable()
export class UserService {

    constructor(private prisma: PrismaService) { }

    async getUser(userId: number) {
        const user = await this.prisma.user.findFirst({
            where: {
                id: userId
            },
            select: {
                id: true,
                email: true,
                tel: true,
                name: true,
                lastName: true
            }
        })

        return {
            succes: true,
            data: user
        }
    }

    async updData(userId: number, data: IUserUpdProc) {

        await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                ...data
            }
        })

        const user = await this.prisma.user.findFirst({
            where: {
                id: userId
            },
            select: {
                id: true,
                name: true,
                lastName: true,
                email: true,
                tel: true
            }
        })

        return {
            succes: true,
            message: 'Профиль успешно обновлён',
            data: user
        }

    }

    async logOut(userId: number) {
        try {
            await this.prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    refreshToken: null,
                    accessToken: null
                }
            })

            return {
                success: true,
                message: 'Выход успешен!'
            }
        } catch (error: any) {
            throw new HttpException({ success: false, message: error.message }, HttpStatus.BAD_GATEWAY)
        }
    }

    async deleteAcc(userId:number){
        try {
            await this.prisma.user.delete({
                where: {
                    id: userId
                }
            })
            return {
                success: true,
                message: 'Аккаунт успешно удалён!'
            }
        } catch (error) {
             throw new HttpException({ success: false, message: 'Ошибка при удалении аккаунта, попробуйте позже!' }, HttpStatus.BAD_GATEWAY)
        }
    }
}
