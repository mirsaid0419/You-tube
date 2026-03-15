import {
  IsString,
  IsNotEmpty,
  IsInt,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: "Izoh bo'sh bo'lmasligi kerak" })
  @MaxLength(1000, { message: 'Izoh juda uzun (maksimal 1000 belgi)' })
  content: string;

  @IsInt()
  @IsNotEmpty()
  videoId: number;
}
