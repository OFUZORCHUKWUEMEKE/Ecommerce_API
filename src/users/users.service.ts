import { Inject, Injectable, HttpException, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUser } from './dto/create-user.dto';
import { User, UserSchema, userTypes } from 'src/shared/schema/user';
import configuration from 'src/config/config';
import { InjectModel } from '@nestjs/mongoose';
import { UserRepository } from 'src/shared/repositories/user.repositories';
import { sendEmail } from 'src/shared/utility/mail-handler';
import { comparePassword, generatePassword } from 'src/shared/utility/password.manager';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { Await } from 'react-router-dom';

const config = configuration()

@Injectable()
export class UsersService {
    constructor(@Inject(UserRepository) private readonly userDB: UserRepository, private readonly jwtService: JwtService, @InjectModel(User.name) private userRepo: Model<User>) { }
    async Create(credentials: CreateUser) {
        try {
            //    generate the hash password
            credentials.password = await generatePassword(credentials.password)

            if (credentials.type === userTypes.ADMIN && credentials.secretToken !== config.adminSecretToken) {
                throw new Error("Not allowed to create admin")
            } else if (credentials.type !== userTypes.CUSTOMER) {
                credentials.isVerified = true
            }
            const user = await this.userDB.findOne({
                email: credentials.email
            })
            // const user = await this.userRepo.findOne({
            //     email:credentials.email
            // })
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

            // if (newUser.type !== userTypes.ADMIN) {
            //     sendEmail(newUser.email, 'Verify Email Template', 'Email verification - Digizone', {
            //         customerName: newUser.name,
            //         customerEmail: newUser.email,
            //         otp
            //     })
            // }
            return {
                success: true,
                message: newUser.type === userTypes.ADMIN ? 'Admin Created' : "Please activate your acccont by verifying your email.",
                result: { email: newUser.email }
            }

        } catch (error) {
            return 'An error occcured'
        }
        // user is already exist

    }

    async handleLogin(email: string, password) {
        try {
            // const userExist = await this.userDB.findOne(email)
            const userExist = await this.userRepo.findOne({
                email: email
            })
            if (!userExist) {
                throw new Error("User not found")
            }
            // if (!userExist.isverified) {
            //     throw new Error("Please verify your email")
            // }
            const isPasswordMatch = await comparePassword(password, userExist.password)

            if (!isPasswordMatch) {
                throw new Error("Invalid email or password")
            }
            const token = await this.jwtService.sign({ _id: userExist._id })

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
            throw new HttpException(error, 400)
        }

    }

    async verifyEmail(otp: string, email: string) {
        try {
            const user = await this.userRepo.findOne({
                email: email
            })
            if (!user) {
                throw new NotFoundException('User Not Found')
            }
            if (user.otp !== otp) {
                throw new Error('Invalid OTP')
            }
            if (user.otpExpiryTime < new Date()) {
                throw new Error('Otp Expired')
            }
            await this.userRepo.updateOne({
                email
            }, { isverified: true })
            user.isverified = true
            await user.save()
            return {
                success: true,
                message: 'Email verified Successfully'
            }
        } catch (error) {
            throw new BadRequestException()
        }
    }

    async sendOtpEmail(email: string) {
        try {
            const user = await this.userRepo.findOne({
                email
            })
            const otp = Math.floor(Math.random() * 900000) + 100000

            const otpExpiryTime = new Date()

            otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 10)
            if (!user) {
                throw new NotFoundException()
            }
            if (!user.isverified) {
                throw new BadRequestException()
            }
            await this.userRepo.updateOne({
                email
            }, { otp, otpExpiryTime })

            // SEND OTP TO CORRESPONDING EMAIL ADDRESS
            // sendEmail()
        } catch (error) {

        }
    }

    async forgotpassword(email: string) {
        try {
            const userExist = await this.userRepo.findOne({
                email: email
            })
            if (!userExist) {
                throw new NotFoundException()
            }
            let password = Math.random().toString(36).substring(2, 12)
            password = await generatePassword(password)
            await this.userRepo.updateOne({
                _id: userExist._id
            }, {
                password
            })
            // SEND CUSTOMER EMAIL
            // sendEmail()
            return {
                success: true,
                message: 'Password sent to your email',
                result: {
                    email: userExist.email, password
                }
            }
        } catch (error) {

        }
    }

    async getUserType(type: string) {
        const users = await this.userRepo.find({
            type
        })
        console.log(users)
        return 'successsfully'
    }

    async findAllUsers() {
         
        const users = await this.userRepo.find({})
        // console.log(users)
        return {
            message:{
                users
            }
        }
    }
}

