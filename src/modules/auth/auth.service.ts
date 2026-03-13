import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/register-auth.dto';
import { LoginDto } from './dto/login.auth.dto';
import { PrismaService } from 'src/core/database/prisma.service';
import { Role } from '@prisma/client';
import fs from "fs";
import { join } from 'path';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}
  async registerAdmin(payload: CreateAuthDto, filename?: string) {
    const email =  await this.prisma.user.findFirst({
      where: {
        OR:[
        {email: payload.email},
        {username: payload.username}
      ]}
    });

    if (email) {
      if (filename) {
        const filePath = join(process.cwd(), 'src', 'uploads', 'Avatar', filename);
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
        avatar: filename ?? null
      }
    })
    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      username:user.username,
      role:user.role
    })

    return {
      success: true,
      message: "Admin created",
      token
    };
  }

  async registerUser(payload: CreateAuthDto, filename?: string) {

    const email =  await this.prisma.user.findFirst({
      where: {
        OR:[
        {email: payload.email},
        {username: payload.username}
      ]}
    });

    if (email) {
      if (filename) {
        const filePath = join(process.cwd(), 'src', 'uploads', 'Avatar', filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      throw new ConflictException('Email or username already exist');
    }

    const user = await this.prisma.user.create({
      data: {
        ...payload,
        role: Role.USER,
        avatar: filename ?? null
      }
    })
    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      username:user.username,
      role:user.role
    })

    return {
      success: true,
      message: "Admin created",
      token
    };
    
  }

  async login(payload: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where:{
        email:payload.email,
        username:payload.username
      }
    })
    if (!user) {
      throw new BadRequestException('Email or username not found');
    }

    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      username:user.username,
      role:user.role
    })

    return {
      success:true,
      token
    }
  }
  
}
