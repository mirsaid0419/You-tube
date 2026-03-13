import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create.Videos.dto';
import { UpdateVideoDto } from './dto/update.Videos.dto';

@Controller('videos')
export class VideosController {
    constructor(private readonly videosService: VideosService) {}

    @Get()
    findAll() {
        return this.videosService.findAll();
    }

    @Post()
    create(@Body() payload: CreateVideoDto) {
        return this.videosService.create(payload);
    }

    @Put()
    update(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateVideoDto) {
        return this.videosService.update(id, payload);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.videosService.remove(id);
    }
}
