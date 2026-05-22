import { Injectable } from '@nestjs/common';
import { CreateRestoDto } from './dto/create-resto.dto';
import { UpdateRestoDto } from './dto/update-resto.dto';
import { PrismaService } from 'src/service/prisma/prisma.service';
import { domainForImg, folderPublicName } from 'src/shared/utils/constants';

@Injectable()
export class RestoService {

  constructor(private prisma:PrismaService){}
  async findAll() {

    const data = await this.prisma.restaurant.findMany({
     include: {
      delivery: true
     },
      orderBy: [
      {order: 'asc'}
    ]
    })
    const workTime = await this.prisma.workingHour.findMany()
    const mainBranch = workTime.filter(item=> item.type == 'REGULAR')
    const franchiseBranch = workTime.filter(item=> item.type == "FRANCHISE")

    return data.map(item=> ({...item, phone: item.phone.toString(),
      workHour: item.isFranchise ? franchiseBranch : mainBranch,
       delivery: item.delivery.map(delivery => ({
    ...delivery,
    phone: delivery.phone?.toString() || '',
    photo: new URL(`${folderPublicName}${delivery.photo}`, domainForImg).toString() 
  }))
}))
  }

}
