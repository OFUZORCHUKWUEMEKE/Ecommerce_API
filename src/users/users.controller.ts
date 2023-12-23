import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { CreateUser } from './dto/create-user.dto';


interface Login {
   email: string
   password: string
}

@Controller('users')
export class UsersController {
   constructor(private readonly usersService: UsersService) {}

   @Post('login')
   @HttpCode(HttpStatus.OK)
   async Login(@Body() login: Login, @Res({ passthrough: true }) response: Response) {
      const loginres = await this.usersService.handleLogin(login.email,login.password)

      if (loginres.success) {
         response.cookie('_digi_auth_token', loginres?.result?.token, { httpOnly: true })
      }

      delete loginres?.result?.token

      return loginres
   }

   @Get('/verify-email/:otp/:email')
   async verifyEmail(@Param('otp') otp:string,@Param('email') email:string){
         return await this.usersService.verifyEmail(otp,email)
   }

   @Post('/create')
   async register(@Body() body: CreateUser) {
      return await this.usersService.Create(body)  
   }
}
