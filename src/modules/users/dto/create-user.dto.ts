import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

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
}
