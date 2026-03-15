import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/core/database/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createCommentDto: CreateCommentDto, userId: number) {
    const { content, videoId } = createCommentDto;

    const video = await this.prisma.video.findUnique({
      where: { id: videoId },
    });

    if (!video) {
      throw new NotFoundException(`ID ${videoId} bo'lgan video topilmadi`);
    }

    return this.prisma.comment.create({
      data: {
        content: content,
        author: {
          connect: { id: userId }, // Kim yozganini bog'laymiz
        },
        video: {
          connect: { id: videoId }, // Qaysi videoga yozilganini bog'laymiz
        },
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true, // Frontendda izoh egasini ko'rsatish uchun kerak
          },
        },
      },
    });
  }

  async findAllByVideo(videoId: number, page: number = 1, limit: number = 10) {
    const video = await this.prisma.video.findUnique({
      where: { id: videoId },
    });

    if (!video) {
      throw new NotFoundException(`ID ${videoId} bo'lgan video topilmadi`);
    }

    // 2. Izohlarni paginatsiya bilan olish
    const skip = (page - 1) * limit;

    const [comments, total] = await this.prisma.$transaction([
      this.prisma.comment.findMany({
        where: { videoId, isDeleted: false },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' }, // Yangi izohlar tepada tursin
        skip: skip,
        take: limit,
      }),
      this.prisma.comment.count({ where: { videoId, isDeleted: false } }),
    ]);

    return {
      data: comments,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async update(id: number, updateCommentDto: UpdateCommentDto, user: any) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException(`ID ${id} bo'lgan izoh topilmadi`);
    }

    const isOwner = comment.authorId === user.id;
    const isAdmin = user.role === Role.ADMIN || user.role === Role.SUPERADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        "Sizda ushbu izohni o'zgartirish huquqi yo'q",
      );
    }

    return this.prisma.comment.update({
      where: { id },
      data: updateCommentDto,
    });
  }

  async remove(id: number, user: any) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException(`ID ${id} bo'lgan izoh topilmadi`);
    }

    const isOwner = comment.authorId === user.id;
    const isAdmin = user.role === Role.ADMIN || user.role === Role.SUPERADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        "Sizda ushbu izohni o'zgartirish huquqi yo'q",
      );
    }
    return this.prisma.comment.update({
      where: { id },
      data: {
        isDeleted: true,
        content: "Ushbu izoh o'chirildi", // Mazmunni ham tozalab tashlash mumkin
      },
    });
  }
  async findOne(id: number) {
    const comment = await this.prisma.comment.findFirst({
      where: { 
        id, 
        isDeleted: false // O'chirilgan izohni ko'rsatmaymiz
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        video: { // Bildirishnoma uchun video ma'lumotlari kerak bo'ladi
          select: {
            id: true,
            title: true,
            thumbnail: true,
          },
        },
      },
    });
  
    if (!comment) {
      throw new NotFoundException(`ID ${id} bo'lgan izoh topilmadi yoki o'chirilgan`);
    }
  
    return comment;
  }
}
