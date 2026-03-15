import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseIntPipe, Put, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { TokenGuard } from 'src/common/guards/token.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/role';

@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  
  @UseGuards(TokenGuard, RoleGuard)
  @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}` })
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Get()
  findAll() {
    return this.usersService.getUsers();
  }
  
  @UseGuards(TokenGuard, RoleGuard)
  @ApiOperation({ summary: `${Role.USER}` })
  @Roles(Role.USER)
  @Get("one")
  async getOneuser(@Req() req: Request) {
    return this.usersService.getOneuser(req["user"])
  }
  @UseGuards(TokenGuard, RoleGuard)
  @ApiOperation({ summary: `${Role.USER} ${Role.SUPERADMIN},${Role.ADMIN}` })
  @Roles(Role.USER,Role.ADMIN,Role.SUPERADMIN)
  @Patch(":id")
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor("file", {
    storage: diskStorage({
      destination: "src/uploads/Avatar",
      filename: (req, file, cb) => {
        const filename = Date.now() + "." + file.mimetype.split("/")[1];
        cb(null, filename);
      }
    })
  }))
  update( 
    @Body() payload: UpdateUserDto,
    @Req() req : Request,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.usersService.updateUser(payload, req["user"] ,file?.filename)
  }
  
  @UseGuards(TokenGuard, RoleGuard)
  @ApiOperation({ summary: `${Role.USER}` })
  @Roles(Role.USER)
  @Delete(":id")
  delete(@Req() req: Request) {
    return this.usersService.deleteUser(req["user"])
  }
}
