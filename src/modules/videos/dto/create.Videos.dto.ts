import { VideoStatus, Visibility } from "@prisma/client";
import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";

export class CreateVideoDto {
    
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    thumbnail?: string;

    @IsString()
    videoUrl: string;

    @IsInt()
    duration: number;

    @IsOptional()
    @IsEnum(VideoStatus)
    status?: VideoStatus;

    @IsOptional()
    @IsEnum(Visibility)
    visibility?: Visibility;

    @IsInt()
    authorId: number;
}