import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string' },
        otp: { type: 'number' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'src/uploads/Avatar',
        filename: (req, file, cb) => {
          const filename = Date.now() + '.' + file.mimetype.split('/')[1];
          cb(null, filename);
        },
      }),
    }),
  )
  @Post('CreateUser')
  async createUser(
    @Body() userCreateDto: CreateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.usersService.createUser(userCreateDto, file?.filename);
  }

  @Get()
  findAll() {
    return this.usersService.getUsers();
  }

  @Get(':id')
  async getOneuser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getOneuser(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}
