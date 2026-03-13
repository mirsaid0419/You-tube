import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateVideoDto } from './dto/create.Videos.dto';
import { UpdateVideoDto } from './dto/update.Videos.dto';

@Injectable()
export class VideosService {
    constructor(private  prisma: PrismaService) {}

    async findAll() {
        return this.prisma.video.findMany();
    }

    async create(payload:CreateVideoDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.authorId
            }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        await this.prisma.video.create({
            data: payload
        });

        return {
            success: true,
            message: 'Video created successfully'
        }
    }

    async update(id: number, payload: UpdateVideoDto) {
        const video = await this.prisma.video.findUnique({
            where: {
                id
            }
        });

        if (!video) {
            throw new NotFoundException('Video not found');
        }

        if (payload.authorId) {
            const user = await this.prisma.user.findUnique({
            where: {
                id: payload.authorId
            }
            });

            if (!user) {
                throw new NotFoundException('User not found');
            }
        }

        await this.prisma.video.update({
            where: {
                id
            },
            data: payload
        });

        return {
            success: true,
            message: 'Video updated successfully'
        }
    }

    async remove(id: number) {
        const video = await this.prisma.video.findUnique({
            where: {
                id
            }
        }); 

        if (!video) {
            throw new NotFoundException('Video not found');    
        }

        await this.prisma.video.delete({
            where: {
                id
            }
        });

        return {
            success: true,
            message: 'Video deleted successfully'
        }
    }
}
