import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma/prisma.service';
import { domainForImg, folderPublicName } from 'src/shared/utils/utils';

@Injectable()
export class FranchiseService {

    constructor(private prisma:PrismaService){}

    async findAll(){
        try {
            const res = await this.prisma.franchise.findMany({
                orderBy: {
                    order: 'asc'
                }
            })
            return res.map(item => ({ ...item, photo: new URL(`${folderPublicName}${item.photo}`, domainForImg).toString() }))

        } catch (error:any) {
            throw new HttpException(error.message|| 'Ошибка сервера!', error.statusCode || 500)
        }
    }

}
