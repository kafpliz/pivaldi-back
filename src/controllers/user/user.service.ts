import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma/prisma.service';

@Injectable()
export class UserService {

    constructor(private prisma:PrismaService){}
    
    async getUser(userId:number){
   
        
        const user = await this.prisma.user.findFirst({
            where: {
                id:userId
            },
            select: {
                id: true,
                email: true,
                tel: true
            }
        })

        return {
            succes: true,
            data: user
        }
    }
}
