import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './service/prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './controllers/auth/auth.service';
import { UserController } from './controllers/user/user.controller';
import { AuthModule } from './controllers/auth/auth.module';
import { EmailService } from './service/email/email.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './shared/guards/auth/auth.guard';
import { UserService } from './controllers/user/user.service';



@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}), AuthModule],
  controllers: [AppController, AuthController, UserController],
  providers: [AppService, PrismaService, AuthService, EmailService, {
    provide: APP_GUARD,
    useClass: AuthGuard
  }, UserService],
})
export class AppModule {}
