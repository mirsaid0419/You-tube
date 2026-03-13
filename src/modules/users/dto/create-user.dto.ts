import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsString } from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsEmail()
    email: string

    @ApiProperty()
    @IsString()
    username: string

    @ApiProperty()
    @IsString()
    firstName: string

    @ApiProperty()
    @IsString()
    lastName: string

    @ApiProperty()
    @IsNumber()
    otp:number
}
