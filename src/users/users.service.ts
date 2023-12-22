import { Inject, Injectable } from '@nestjs/common';
import { CreateUser } from './dto/create-user.dto';
import { userTypes } from 'src/shared/schema/user';
import configuration from 'src/config/config';
import { InjectModel } from '@nestjs/mongoose';
import { UserRepository } from 'src/shared/repositories/user.repositories';
import { sendEmail } from 'src/shared/utility/mail-handler';
import { comparePassword, generatePassword } from 'src/shared/utility/password.manager';
import { JwtService } from '@nestjs/jwt';

const config = configuration()

@Injectable()
export class UsersService {
    constructor(@Inject(UserRepository) private readonly userDB: UserRepository, private readonly jwtService: JwtService) { }
    async Create(credentials: CreateUser) {
        try {
            //    generate the hash password
            credentials.password = await generatePassword(credentials.password)

            if (credentials.type === userTypes.ADMIN && credentials.secretToken !== config.adminSecretToken) {
                throw new Error("Not allowed to create admin")
            } else {
                credentials.isVerified = true
            }
            const user = await this.userDB.findOne({
                email: credentials.email
            })
            if (user) {
                throw new Error("User Already Exist")
            }

            const otp = Math.floor(Math.random() * 900000) + 100000

            const otpExpiryTime = new Date()

            otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 10)

            const newUser = await this.userDB.create({
                ...credentials,
                otp,
                otpExpiryTime
            })

            if (newUser.type !== userTypes.ADMIN) {
                sendEmail(newUser.email, 'Verify Email Template', 'Email verification - Digizone', {
                    customerName: newUser.name,
                    customerEmail: newUser.email,
                    otp
                })
            }
            return {
                success: true,
                message: newUser.type === userTypes.ADMIN ? 'Admin Created' : "Please activate your acccont by verifying your email.",
                result: { email: newUser.email }
            }

        } catch (error) {
            throw error
        }
        // user is already exist

    }

    async handleLogin(email: string, password) {
        try {
            const userExist = await this.userDB.findOne(email)
            if (!userExist) {
                throw new Error("User not found")
            }
            if (!userExist.isverified) {
                throw new Error("Please verify your email")
            }
            const isPasswordMatch = await comparePassword(password, userExist.password)

            if (!isPasswordMatch) {
                throw new Error("Invalid email or password")
            }
            const token = await this.jwtService.sign(userExist._id)

            return {
                success: true,
                message: 'Login Successful',
                result: {
                    user: {
                        name: userExist.name,
                        email: userExist.email,
                        type: userExist.type,
                        id: userExist._id.toString()
                    },
                    token
                }
            }
        } catch (error) {
            throw new Error(error)
        }

    }
}
