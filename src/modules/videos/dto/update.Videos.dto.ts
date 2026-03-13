import { PartialType } from "@nestjs/mapped-types";
import { CreateVideoDto } from "./create.Videos.dto";

export class UpdateVideoDto extends PartialType(CreateVideoDto){}