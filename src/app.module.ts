import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/config'
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionFilter } from './exception/http-exception';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';

const config = configuration()

@Module({
  imports: [ConfigModule.forRoot({
    load: [configuration],
    isGlobal: true
  }), MongooseModule.forRoot(config.mongodburl), UsersModule, JwtModule.register({
    global: true,
    secret: config.jwt_secret,
    signOptions: { expiresIn: '30d' }

  })],
  controllers: [AppController],
  providers: [AppService, { provide: APP_FILTER, useClass: AllExceptionFilter }],
})
export class AppModule { }
