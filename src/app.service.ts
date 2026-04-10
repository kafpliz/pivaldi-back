import { Injectable } from '@nestjs/common';
import { PrismaService } from './service/prisma/prisma.service';

@Injectable()
export class AppService {

  constructor(private prisma:PrismaService){}

 async getHello() {

    return await 'Hello gay';
  }
}
