import { IsNotEmpty, IsString,IsIn,IsOptional } from "class-validator/types/decorator/decorators";
import { userTypes } from "src/shared/schema/user";
export class CreateUser {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsIn([userTypes.ADMIN,userTypes.CUSTOMER])
    type: string

    @IsOptional()
    @IsString()
    secretToken: string

}