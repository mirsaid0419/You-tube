import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/register-auth.dto';
import { LoginDto } from './dto/login.auth.dto';
import { PrismaService } from 'src/core/database/prisma.service';
import { Role } from '@prisma/client';
import fs from 'fs';
import { join } from 'path';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import Redis from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { EmailService } from 'src/common/email/email.service';
import { OtpDto } from './dto/otp.dto';
@Injectable()
export class AuthService {
  private readonly redis: Redis;
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly clodinary: CloudinaryService,
    private readonly redisService: RedisService,
    private readonly emailService: EmailService,
  ) {
    this.redis = this.redisService.getOrThrow();
  }
  async registerAdmin(payload: CreateAuthDto, filename?: string) {
    const email = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: payload.email }, { username: payload.username }],
      },
    });

    if (email) {
      if (filename) {
        const filePath = join(
          process.cwd(),
          'src',
          'uploads',
          'Avatar',
          filename,
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      throw new ConflictException('Email or username already exist');
    }

    const user = await this.prisma.user.create({
      data: {
        ...payload,
        role: Role.ADMIN,
        avatar: filename ?? null,
      },
    });
    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    return {
      success: true,
      message: 'Admin created',
      token,
    };
  }

  async registerUser(payload: CreateAuthDto, file?: Express.Multer.File) {
    const email = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: payload.email }, { username: payload.username }],
      },
    });

    if (email) {
      throw new ConflictException('Email or username already exist');
    }

    const verify = await this.verifyOtp(payload.email, `${payload.otp}`);
    const { otp, ...data } = payload;
    let avatar: any;
    if (file) {
      avatar = await this.clodinary.uploadFile(file, 'prfile images');
    }
    console.log(avatar)
    const user = await this.prisma.user.create({
      data: {
        ...data,
        role: Role.USER,
        avatar: avatar.url,
      },
    });
    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    return {
      success: true,
      message: 'User created',
      token,
    };
  }

  async login(payload: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: payload.email,
        username: payload.username,
      },
    });
    if (!user) {
      throw new BadRequestException('Email or username not found');
    }

    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    return {
      success: true,
      token,
    };
  }

  async sendOtp(payload: OtpDto) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const key = `otp:${payload.email}`;

    try {
      await this.redis.set(key, otp, 'EX', 120);

      await this.emailService.sendOtpEmail(payload.email, otp);

      return {
        success: true,
        message: 'Tasdiqlash kodi email manzilingizga yuborildi.',
      };
    } catch (error) {
      console.error('OTP yuborishda xatolik:', error);
      throw new InternalServerErrorException(
        'Email yuborish tizimida xatolik yuz berdi.',
      );
    }
  }

  async verifyOtp(email: string, submittedOtp: string): Promise<boolean> {
    const key = `otp:${email}`;
    const savedOtp = await this.redis.get(key);

    if (!savedOtp) {
      throw new BadRequestException(
        "Tasdiqlash kodi muddati tugagan yoki so'ralmagan.",
      );
    }

    if (savedOtp !== submittedOtp) {
      throw new BadRequestException("Kiritilgan tasdiqlash kodi noto'g'ri.");
    }

    await this.redis.del(key);

    return true;
  }
}
