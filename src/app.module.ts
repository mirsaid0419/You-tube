import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { VideosModule } from './modules/videos/videos.module';
import { PrismaModule } from './core/database/prsima.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    UsersModule, 
    VideosModule, 
    PrismaModule
  ],
})
export class AppModule {}
