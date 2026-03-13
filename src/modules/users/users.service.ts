import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async createUser(createUserDto: CreateUserDto, filename?: string) {
    try {
      const existUser = await this.prisma.user.findUnique({
        where: { username: createUserDto.username }
      })

      if (existUser) throw new BadRequestException("User already exist with this user name");


      await this.prisma.user.create({
        data: {
          username: createUserDto.username,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          email: createUserDto.email,
          role: "USER",
          avatar: filename
        }
      })

      return {
        success: true,
        message: "User created",
      };
    } catch (error) {
      return error.message
    }
  }

  async getUsers() {
    return this.prisma.user.findMany({});
  }

  async getOneuser(id: number) {
    try {
      const existUser = await this.prisma.user.findUnique({
        where: { id }
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

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          ...updateUserDto
        }
      })

      return {
        success: true,
        message: "User updated",
        data: user
      }
    } catch (error) {
      throw new NotFoundException("User not found")
    }
  }

  async deleteUser(id: number) {
    const user = await this.prisma.user.delete({
      where: { id }
    })

    if (!user) throw new NotFoundException("User not found")

    return {
      success: true,
      message: " User deleted",
      data: user
    }
  }
}
