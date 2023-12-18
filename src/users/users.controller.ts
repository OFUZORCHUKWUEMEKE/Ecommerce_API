import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { CreateUser } from './dto/create-user.dto';


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
      const loginres = await this.usersService.handleLogin(login)
      
      if(loginres.result.success){
         response.cookie('_digi_auth_token',loginres.result.token,{httpOnly:true})
      }

      delete loginres.result.token

      return loginres
  }

  @Post('/create')
  async register(@Body() body:CreateUser){
     return await this.usersService.Create(body)
  }
}
