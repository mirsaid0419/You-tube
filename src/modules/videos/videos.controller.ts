import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create.Videos.dto';
import { UpdateVideoDto } from './dto/update.Videos.dto';
import { TokenGuard } from 'src/common/guards/token.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/role';

@Controller('videos')
@ApiBearerAuth()
export class VideosController {
    constructor(private readonly videosService: VideosService) {}
    
    @Get()
    findAll() {
        return this.videosService.findAll();
    }

    @UseGuards(TokenGuard, RoleGuard)
    @ApiOperation({ summary: `${Role.USER}` })
    @Roles(Role.USER)
    @Get('my-videos')
    findAllByUser(@Req() req: Request) {
        return this.videosService.findAllByUser(req["user"]);
    }

    @UseGuards(TokenGuard, RoleGuard)
    @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}, ${Role.USER}` })
    @Roles(Role.SUPERADMIN, Role.ADMIN, Role.USER)
    @Get('videos/:userId')
    findAllByUserId(@Param('userId', ParseIntPipe) userId: number) {
        return this.videosService.findAllByUserId(userId);
    }
    
    @UseGuards(TokenGuard, RoleGuard)
    @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}, ${Role.USER}` })
    @Roles(Role.SUPERADMIN, Role.ADMIN, Role.USER)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.videosService.findOne(id);
    }
    
    @UseGuards(TokenGuard, RoleGuard)
    @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}, ${Role.USER}` })
    @Roles(Role.SUPERADMIN, Role.ADMIN, Role.USER)
    @Post()
    create(@Body() payload: CreateVideoDto, @Req() req: Request) {
        return this.videosService.create(payload, req["user"]);
    }
    
    @UseGuards(TokenGuard, RoleGuard)
    @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}, ${Role.USER}` })
    @Roles(Role.SUPERADMIN, Role.ADMIN, Role.USER)
    @Put()
    update(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateVideoDto, @Req() req: Request) {
        return this.videosService.update(id, payload, req["user"]);
    }
    
    @UseGuards(TokenGuard, RoleGuard)
    @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}, ${Role.USER}` })
    @Roles(Role.SUPERADMIN, Role.ADMIN, Role.USER)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
        return this.videosService.remove(id, req["user"]);
    }
}
