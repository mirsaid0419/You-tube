import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateVideoDto } from './dto/create.Videos.dto';
import { UpdateVideoDto } from './dto/update.Videos.dto';
import { Role, VideoStatus } from '@prisma/client';

@Injectable()
export class VideosService {
    constructor(private  prisma: PrismaService) {}

    async findAll() {
        return await this.prisma.video.findMany({
            where: {
                status: 'PUBLISHED'
            },
            select: {
                id: true,
                title: true,
                description: true,
                thumbnail: true,
                videoUrl: true,
                duration: true,
                author: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatar: true
                    }
                }
            }
        });
    }

    async findAllByUser(currentUser:{id: number, role: Role}) {
        return await this.prisma.video.findMany({
            where: {
                authorId: currentUser.id,
                status: {
                    in: ['PUBLISHED', 'UPLOADING']
                }
            },
            select: {
                id: true,
                title: true,
                description: true,
                thumbnail: true,
                videoUrl: true,
                duration: true
            }
        });
    }

    async findAllByUserId(userId: number) {
        return await this.prisma.video.findMany({
            where: {
                authorId: userId,
                status: 'PUBLISHED'
            },
            select: {
                id: true,
                title: true,
                description: true,
                thumbnail: true,
                videoUrl: true,
                duration: true,
                author: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatar: true
                    }
                }
            }
        });
    }

    async findOne(id: number) {
        const video = await this.prisma.video.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                title: true,
                description: true,
                thumbnail: true,
                videoUrl: true,
                duration: true,
                author: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatar: true
                    }
                }
            }
        });

        return {
            success: true,
            data: video
        }
    }

    async create(payload:CreateVideoDto, currentUser:{id: number, role: Role}) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: currentUser.id
            }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const video = await this.prisma.video.create({
            data: {
                ...payload,
                authorId: currentUser.id,
                status: VideoStatus.UPLOADING
            }
        });

        setTimeout(async () => {
        await this.prisma.video.update({
            where: { id: video.id },
            data: { status: VideoStatus.PUBLISHED }
        });
        }, 1 * 60 * 1000);

        return {
            success: true,
            message: 'Video created successfully'
        }
    }

    async update(id: number, payload: UpdateVideoDto, currentUser:{id: number, role: Role}) {
        const video = await this.prisma.video.findUnique({
            where: {
                id
            }
        });

        if (!video) {
            throw new NotFoundException('Video not found');
        }

        if (currentUser.role == Role.ADMIN || currentUser.role == Role.SUPERADMIN) {
            await this.prisma.video.update({
                where: {
                    id
                },
                data: {
                    ...payload,
                    status: VideoStatus.PROCESSING
                }
            });

            setTimeout(async () => {
            await this.prisma.video.update({
                where: { id: video.id },
                data: { status: VideoStatus.PUBLISHED }
            });
            }, 1 * 60 * 1000);
    
            return {
                success: true,
                message: 'Video updated successfully'
            }
        }

        if (currentUser.id !== video.authorId) {
            throw new NotFoundException('You are not the author of this video');
        }

        await this.prisma.video.update({
            where: {
                id
            },
            data: {
                ...payload,
                status: VideoStatus.PROCESSING
            }
        });

        setTimeout(async () => {
        await this.prisma.video.update({
            where: { id: video.id },
            data: { status: VideoStatus.PUBLISHED }
        });
        }, 1 * 60 * 1000);

        return {
            success: true,
            message: 'Video updated successfully'
        }
    }

    async remove(id: number, currentUser:{id: number, role: Role}) {
        const video = await this.prisma.video.findUnique({
            where: {
                id
            }
        }); 

        if (!video) {
            throw new NotFoundException('Video not found');    
        }

        if (currentUser.role == Role.ADMIN || currentUser.role == Role.SUPERADMIN) {
            await this.prisma.video.update({
                where: {
                    id
                },
                data: {
                    status: 'DELETED'
                }
            });

            return {
                success: true,
                message: 'Video deleted successfully'
            }
        }

        if (currentUser.id !== video.authorId) {
            throw new NotFoundException('You are not the author of this video');
        }

        await this.prisma.video.update({
            where: {
                id
            },
            data: {
                status: 'DELETED'
            }
        });

        return {
            success: true,
            message: 'Video deleted successfully'
        }
    }
}
