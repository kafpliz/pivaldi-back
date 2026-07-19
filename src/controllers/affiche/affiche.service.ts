import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma/prisma.service';
import { domainForImg, folderPublicName } from 'src/shared/utils/constants';

@Injectable()
export class AfficheService {

    constructor(private prisma: PrismaService) { }

    async findAll(id: number) {
        try {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

            const res = await this.prisma.affiche.findMany({
                where: {
                    time: {
                        gte: startOfMonth,
                        lte: endOfMonth
                    },
                    restaurantId: id
                },
                orderBy: {
                    time: 'asc'
                }
            })
           for (const item of res) {
             console.log(new Date(item.time).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }));
           }
            
            return res.map(item => ({ ...item, photo: new URL(`${folderPublicName}${item.photo}`, domainForImg).toString(), }))

        } catch (error: any) {
            throw new HttpException(error, 500)
        }
    }
}
