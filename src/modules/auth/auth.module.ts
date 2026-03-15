import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'shaftoli',
      signOptions: { expiresIn: '1d' },
    }),
    CloudinaryModule,
    RedisModule
  ],

  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
