import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';


interface Login {
   username:string
   password:string
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService){}

  @Post('login')
  @HttpCode(HttpStatus.OK) 
  async Login(@Body() login:Login,@Res({passthrough:true}) response:Response) {
      return await this.usersService.handleLogin(login)
  }
}
