import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/service/prisma/prisma.service';
import { IS_PUBLIC_KEY } from 'src/shared/decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private prisma: PrismaService, private jwt: JwtService, private reflector: Reflector) { }

  async canActivate(
    context: ExecutionContext,
  ):  Promise<boolean>  {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)

    if (!token) {
      throw new HttpException({ message: 'Токен отсутсвует', success: false }, HttpStatus.UNAUTHORIZED)
    }

    try {
      const payload = await this.jwt.verifyAsync(token)
      const user = await this.prisma.user.findFirst({
        where: {
          id: payload.sub
        },
        select: {
          id: true,
          email: true,
          tel: true,
        }
      })

      if(!user){
        throw new HttpException({ message: 'Пользователь не найден', success: false }, HttpStatus.UNAUTHORIZED)
      }
      request['user'] = {
        ...user
      }
      return true
    } catch (error:any) {
         if (error.name === 'TokenExpiredError') {
         throw new HttpException({ message: 'Токен истёк', success: false }, HttpStatus.UNAUTHORIZED)
      }
       if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw   new HttpException({ message: "Недействительный токен", success: false }, HttpStatus.UNAUTHORIZED)  

    }


    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
