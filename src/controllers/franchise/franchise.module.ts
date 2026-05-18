import { Module } from '@nestjs/common';
import { FranchiseService } from './franchise.service';
import { FranchiseController } from './franchise.controller';
import { PrismaService } from 'src/service/prisma/prisma.service';

@Module({
  controllers: [FranchiseController],
  providers: [FranchiseService,PrismaService],
})
export class FranchiseModule {}
