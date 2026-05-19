import { Module } from '@nestjs/common';
import { RulesService } from './rules.service';
import { RulesController } from './rules.controller';
import { PrismaService } from 'src/service/prisma/prisma.service';

@Module({
  controllers: [RulesController],
  providers: [RulesService, PrismaService],
})
export class RulesModule {}
