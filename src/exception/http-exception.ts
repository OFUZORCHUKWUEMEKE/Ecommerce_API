import { ArgumentsHost, ExceptionFilter, HttpException, HttpStatus,Catch } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

export interface HttpExceptionResponse{
    statusCode:number,
    message:string,
    error:string
}
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) { }
    catch(exception: any, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp()

        const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

        const exceptionResponse = exception instanceof HttpException ? ctx.getResponse() : String(exception)

        const responseBody = {
            statusCode: httpStatus,
            timeStamp: new Date().toISOString(),
            path: httpAdapter.getRequestUrl(ctx.getResponse()),
            message:(exceptionResponse as HttpExceptionResponse).message ||(exceptionResponse as HttpExceptionResponse).error || exceptionResponse || "Something went Wrong"
        }
        httpAdapter.reply(ctx.getResponse(),responseBody,httpStatus)
    }
}