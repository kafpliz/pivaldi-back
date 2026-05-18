import { Module } from '@nestjs/common';
import { RestoService } from './resto.service';
import { RestoController } from './resto.controller';
import { PrismaService } from 'src/service/prisma/prisma.service';

@Module({
  controllers: [RestoController],
  providers: [RestoService, PrismaService],
})
export class RestoModule {}
