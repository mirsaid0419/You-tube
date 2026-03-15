import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class OtpDto {
  @ApiProperty()
  @IsEmail()
  @IsString()
  email: string;
}
