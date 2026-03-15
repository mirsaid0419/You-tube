import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { TokenGuard } from 'src/common/guards/token.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role';
import { Role } from '@prisma/client';
import { ApiOperation } from '@nestjs/swagger';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: 'Yangi izoh qoldirish' })
  @Roles(Role.USER) 
  @UseGuards(TokenGuard, RoleGuard)
  @Post()
  async create(@Body() createCommentDto: CreateCommentDto, @Req() req: any) {
    const userId = req.user.id;
    return this.commentsService.create(createCommentDto, userId);
  }

  @ApiOperation({ summary: 'Videoga tegishli barcha izohlarni olish' })
  @Get('video/:videoId')
  async findAllByVideo(
    @Param('videoId', ParseIntPipe) videoId: number,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ) {
    return this.commentsService.findAllByVideo(videoId, page, limit);
  }

  @ApiOperation({ summary: 'Izohni tahrirlash (Ega, Admin yoki SuperAdmin)' })
  @UseGuards(TokenGuard)   @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: any,
  ) {
    return this.commentsService.update(id, updateCommentDto, req.user);
  }

  @ApiOperation({ summary: "Izohni o'chirish (Soft Delete)" })
  @UseGuards(TokenGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    await this.commentsService.remove(id, req.user);
    return {
      success: true,
      message: "Izoh muvaffaqiyatli o'chirildi (Soft Delete)",
    };
  }

  @ApiOperation({ summary: "ID bo'yicha bitta izohni olish (Notification uchun)" })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.findOne(id);
  }
}