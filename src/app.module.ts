import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './service/prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { RestoModule } from './controllers/resto/resto.module';
import { RulesModule } from './controllers/rules/rules.module';
import { EmailSletterModule } from './controllers/email-sletter/email-sletter.module';
import { EmailService } from './service/email/email.service';
import { FranchiseModule } from './controllers/franchise/franchise.module';
import { PushModule } from './controllers/push/push.module';
import { AfficheModule } from './controllers/affiche/affiche.module';
import { CategoryModule } from './controllers/category/category.module';




@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}), RestoModule, RulesModule, EmailSletterModule, FranchiseModule, PushModule, AfficheModule, CategoryModule],
  controllers: [AppController,],
  providers: [AppService, PrismaService,  EmailService,  ],
})
export class AppModule {}
