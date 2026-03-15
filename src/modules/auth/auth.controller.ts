import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/register-auth.dto';
import { LoginDto } from './dto/login.auth.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { TokenGuard } from 'src/common/guards/token.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role';
import { Role } from '@prisma/client';

@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @UseGuards(TokenGuard, RoleGuard)
  @ApiOperation({ summary: `${Role.SUPERADMIN}` })
  @Roles(Role.SUPERADMIN)
  @Post("register/admin")
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: "string" },
        firstName: { type: "string" },
        lastName: { type: "string" },
        email: { type: "string" },
        otp:{type:"number"},
        file: { type: "string", format: "binary" },
      },
    }
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: 'src/uploads/Avatar',
      filename: (req, file, cb) => {
        const filename = Date.now() + "." + file.mimetype.split("/")[1];
        cb(null, filename);
      }
    })
  }))
  registerAdmin(
    @Body() payload: CreateAuthDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.authService.registerAdmin(payload, file?.filename);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: "string" },
        firstName: { type: "string" },
        lastName: { type: "string" },
        email: { type: "string" },
        file: { type: "string", format: "binary" },
      },
    }
  })
  
  @Post("register/user")
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: 'src/uploads/Avatar',
      filename: (req, file, cb) => {
        const filename = Date.now() + "." + file.mimetype.split("/")[1];
        cb(null, filename);
      }
    })
  }))
  registerUser(
    @Body() payload: CreateAuthDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.authService.registerUser(payload, file?.filename);
  }


  @Post("login")
  login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }
}
