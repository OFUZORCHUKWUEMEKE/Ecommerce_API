import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/config'
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

const config = configuration()

@Module({
  imports: [ConfigModule.forRoot({
    load:[configuration],
    isGlobal:true
  })],
  controllers: [AppController],  
  providers: [AppService],
})
export class AppModule {}
