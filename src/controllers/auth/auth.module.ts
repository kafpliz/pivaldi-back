import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/service/prisma/prisma.service';
import { AuthController } from './auth.controller';
import { EmailService } from 'src/service/email/email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';



@Module({
    imports: [PassportModule.register({ defaultStrategy: "jwt" }), JwtModule.registerAsync({
        imports: [ConfigModule],
        useFactory: async (config: ConfigService) => ({
            signOptions: { expiresIn: '30m' },
            secret: config.get<string>('JWT_SECRET')
        }),
        inject: [ConfigService],
    })],
    providers: [AuthService, PrismaService, EmailService],
    controllers: [AuthController],
    exports: [AuthService, JwtModule]
})
export class AuthModule { }
