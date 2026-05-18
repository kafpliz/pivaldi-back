import { Module } from '@nestjs/common';
import { EmailSletterService } from './email-sletter.service';
import { EmailSletterController } from './email-sletter.controller';
import { PrismaService } from 'src/service/prisma/prisma.service';
import { EmailService } from 'src/service/email/email.service';

@Module({
  controllers: [EmailSletterController],
  providers: [EmailSletterService, PrismaService, EmailService],
})
export class EmailSletterModule {}
