import { PartialType } from "@nestjs/mapped-types";
import { CreateVideoDto } from "./create.Videos.dto";
import { IsOptional } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateVideoDto extends PartialType(CreateVideoDto){}