import { IsEmpty, IsString } from "class-validator";

export class LoginDto {
    @IsString()
    @IsEmpty()
    username: string;

    @IsString()
    @IsEmpty()
    email: string;
}