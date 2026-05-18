import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest()
    const statusCode = context.switchToHttp().getResponse().statuseCode
    return next.handle().pipe(
      map((data) => ({
        statusCode: statusCode || 200,
        message: data?.message || 'Success',
        data: data?.data !== undefined ? data.data : data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
