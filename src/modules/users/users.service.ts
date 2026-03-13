import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/core/database/prisma.service';
import { join } from 'path';
import fs from "fs";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) { }
  async getUsers() {
    return this.prisma.user.findMany({});
  }

  async getOneuser(currentUser:{id: number}) {
    try {
      const existUser = await this.prisma.user.findUnique({
        where: { id: currentUser.id }
      });

      if (!existUser) throw new BadRequestException("User not found with this ID")

      return {
        success: true,
        data: existUser
      }
    } catch (error) {
      throw new BadRequestException("User not found with this ID")
    }
  }

  async updateUser(payload: UpdateUserDto, currentUser:{id: number} ,filename?: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: currentUser.id }
      })
      if (user) {
        throw new BadRequestException("User not found")
      }

      if (payload.email) {
        const email = await this.prisma.user.findFirst({
          where: {
            email: payload.email
          }
        })
        if (email) {
          throw new BadRequestException("Email already exist")
        }
      }

      if (payload.username) {
        const username = await this.prisma.user.findFirst({
          where: {
            username: payload.username
          }
        })
        if (username) {
          throw new BadRequestException("Username already exist")
        }
      }
      let photo = user!.avatar
      if (filename) {
        const filePath = join(process.cwd(), 'src', 'uploads', 'Avatar', filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        photo = filename
      }
      const userUpdated = await this.prisma.user.update({
        where: { id: currentUser.id },
        data: {
          ...payload,
          avatar: photo
        }
      })

      const token = this.jwtService.sign({
        id: userUpdated.id,
        email: userUpdated.email,
        username:userUpdated.username,
        role:userUpdated.role
      })

      return {
        success: true,
        message: "User updated",
        token
      }
    } catch (error) {
      throw new NotFoundException("User not found")
    }
  }

  async deleteUser(currentUser:{id: number}) {
    const existUser = await this.prisma.user.findUnique({
      where: { id: currentUser.id }
    })

    if (!existUser) throw new NotFoundException("User not found")

    const user = await this.prisma.user.delete({
      where: { id: currentUser.id }
    })

    if (!user) throw new NotFoundException("User not found")

    return {
      success: true,
      message: " User deleted",
    }
  }
}
