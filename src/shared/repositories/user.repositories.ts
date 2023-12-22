import { InjectModel } from "@nestjs/mongoose";
import { User } from "../schema/user";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserRepository {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) { }

    async findOne(query: any) {
        return await this.userModel.findOne(query)
    }

    async create(data) {
        return await this.userModel.create(data)
    }
} 