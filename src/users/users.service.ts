import { Injectable } from '@nestjs/common';
import { CreateUser } from './dto/create-user.dto';

@Injectable()
export class UsersService {

    async Create(credentials: CreateUser) {
        try {
            //    generate the hash password
            
        } catch (error) {
            throw error
        }
    }

    async handleLogin({ username, password }) {
        return {
            result: {
                token: '',
                success: ''
            }
        }
    }
}
