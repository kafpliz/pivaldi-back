import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CategoryType } from '@prisma/client';
import { PrismaService } from 'src/service/prisma/prisma.service';
import { domainForImg, folderPublicName } from 'src/shared/utils/constants';

@Injectable()
export class CategoryService {
    
    constructor(private prisma:PrismaService){}

    async getCategory(type:CategoryType){
        const res = await this.prisma.category.findMany({
            where: {
                type: type
            },
            orderBy: {
                name: 'asc'
            }
        })

        return res.filter(item=> item.name != "акции").map(item => ({ ...item, photo: new URL(`${folderPublicName}${item.photo}`, domainForImg).toString() }))
    }

    async getMenuItem(id:number){
        const res = await this.prisma.menuItem.findMany({
            where: {
                categoryId: id
            }
        })

        return res.map(item => ({ ...item, photo: new URL(`${folderPublicName}${item.photo}`, domainForImg).toString() }))
    }

    async getMainSwiper(){
        try {
            const res = await this.prisma.menuItem.findMany({
                where: {
                    categoryId: 14
                }
            })
           
            
            return res.map(item => ({ ...item, photo: new URL(`${folderPublicName}${item.photo}`, domainForImg).toString() }))

        } catch (error:any) {
            throw new HttpException(error, HttpStatus.BAD_GATEWAY)
        }
    }



    async getStock(type:CategoryType){
        try {
            const categoryId = type == 'REGULAR' ? 16: 27
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
