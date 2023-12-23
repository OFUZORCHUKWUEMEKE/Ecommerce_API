import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configuration from './config/config';
import { TransformationInterceptor } from './exception/response-interceptor';
import {ValidationPipe} from '@nestjs/common'
import { HttpExceptionFilter } from './shared/exceptions/http.exceptions';
import { ModelExceptionFilter } from './shared/exceptions/model-exception';

const config = configuration();

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new TransformationInterceptor())  

  app.useGlobalPipes(new ValidationPipe())

  app.useGlobalFilters(new HttpExceptionFilter(),new ModelExceptionFilter())
  
  await app.listen(config.port);

}
bootstrap();
