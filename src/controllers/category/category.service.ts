import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CategoryType } from '@prisma/client';
import { PrismaService } from 'src/service/prisma/prisma.service';
import { domainForImg, folderPublicName, positionIds } from 'src/shared/utils/constants';

@Injectable()
export class CategoryService {
    
    constructor(private prisma:PrismaService){}

    async getCategory(type:CategoryType){
        const res = await this.prisma.category.findMany({
            where: {
                type: type
            },
            orderBy: {
                order: 'asc'
            }
        })

        return res.map(item => ({ ...item, photo: new URL(`${folderPublicName}${item.photo}`, domainForImg).toString() }))
    }

    async getMenuItem(id:number){
        const res = await this.prisma.menuItem.findMany({
            where: {
                categoryId: id
            },
            orderBy: {
                order: 'asc'
            }
        })

        return res.map(item => ({ ...item, photo: new URL(`${folderPublicName}${item.photo}`, domainForImg).toString() }))
    }

    async getMainSwiper(){
        try {
            const res = await this.prisma.menuItem.findMany({
                where: {
                    categoryId: positionIds.main
                }
            })
           
            
            return res.map(item => ({ ...item, photo: new URL(`${folderPublicName}${item.photo}`, domainForImg).toString() }))

        } catch (error:any) {
            throw new HttpException(error, HttpStatus.BAD_GATEWAY)
        }
    }



    async getStock(type:CategoryType){
        try {
            const categoryId = type == 'REGULAR' ? positionIds.stockReg : positionIds.stockFr
         const res = await this.prisma.menuItem.findMany({
                where: {
                    categoryId
                }
            })
           
            
            return res.map(item => ({ ...item, photo: new URL(`${folderPublicName}${item.photo}`, domainForImg).toString() }))

        } catch (error:any) {
            throw new HttpException(error, HttpStatus.BAD_GATEWAY)
        }
    }

}
