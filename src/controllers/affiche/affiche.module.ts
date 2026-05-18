import { Module } from '@nestjs/common';
import { AfficheService } from './affiche.service';
import { AfficheController } from './affiche.controller';
import { PrismaService } from 'src/service/prisma/prisma.service';

@Module({
  controllers: [AfficheController],
  providers: [AfficheService,PrismaService],
})
export class AfficheModule {}
