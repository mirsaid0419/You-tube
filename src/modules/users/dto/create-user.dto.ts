// import { ApiProperty } from "@nestjs/swagger";
// import { IsEmail, IsNumber, IsString } from "class-validator";

// export class CreateUserDto {
//     @ApiProperty()
//     @IsEmail()
//     email: string

//     @ApiProperty()
//     @IsString()
//     username: string

//     @ApiProperty()
//     @IsString()
//     firstName: string

//     @ApiProperty()
//     @IsString()
//     lastName: string

//     @ApiProperty()
//     @IsNumber()
//     otp:number
// }

import { IsEmail, IsNotEmpty, IsString, IsNumber, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsEmail({}, { message: "Noto'g'ri email formati" })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value)) 
  otp: number;
}