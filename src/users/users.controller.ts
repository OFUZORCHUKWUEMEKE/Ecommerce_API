import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)  
  async Login() {

  }
}
