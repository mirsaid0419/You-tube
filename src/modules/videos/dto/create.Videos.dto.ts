import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { VideoStatus, Visibility } from "@prisma/client";
import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";

export class CreateVideoDto {
    @ApiProperty()
    @IsString()
    title: string;
    
    @ApiPropertyOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional()
    @IsString()
    thumbnail?: string;
    
    @ApiProperty()
    @IsString()
    videoUrl: string;
    
    @ApiProperty()
    @IsInt()
    duration: number;
    
    @ApiPropertyOptional({enum: Visibility})
    @IsEnum(Visibility)
    visibility?: Visibility;
}