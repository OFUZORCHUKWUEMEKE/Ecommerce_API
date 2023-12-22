import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from 'src/shared/repositories/user.repositories';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/shared/schema/user';

@Module({
  imports:[MongooseModule.forFeature([{name:User.name,schema:UserSchema}])],
  controllers: [UsersController],
  providers: [UsersService,UserRepository],
})
export class UsersModule {}
