import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configuration from './config/config';
import { TransformationInterceptor } from './exception/response-interceptor';

const config = configuration()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new TransformationInterceptor())
  await app.listen(config.port);
}
bootstrap();
