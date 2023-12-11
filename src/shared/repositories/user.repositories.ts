import { InjectModel } from "@nestjs/mongoose";
import { User } from "../schema/user";
import { Model } from "mongoose";

export class UserRepositoty{
    constructor(@InjectModel(User.name) private readonly userModel:Model<User>){}
} 