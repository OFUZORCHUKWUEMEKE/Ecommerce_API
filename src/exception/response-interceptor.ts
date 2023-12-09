import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable, map } from 'rxjs'
export class TransformationInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const statusCode = context.switchToHttp().getResponse().statusCode
        const path = context.switchToHttp().getRequest().url
        return next.handle().pipe(
            map((data) => ({
                message: data.message,
                success: data.success,
                result: data.result,
                timeStamps: new Date(),
                path,
                statusCode,
                error: null
            }))
        )
    }
}