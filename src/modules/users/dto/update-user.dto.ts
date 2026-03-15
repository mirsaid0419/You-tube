import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: "Noto'g'ri email formati" })
  email?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;
}
