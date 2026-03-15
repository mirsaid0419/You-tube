import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { CommentsModule } from './modules/comments/comments.module';
import { UsersModule } from './modules/users/users.module';
import { VideosModule } from './modules/videos/videos.module';
import { PrismaModule } from './core/database/prsima.module';
import { AuthModule } from './modules/auth/auth.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { EmailModule } from './common/email/email.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: config.get('EMAIL_USER'),
            pass: config.get('EMAIL_PASS'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('EMAIL_USER')}>`,
        },
      }),
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        config: {
          url: `redis://${config.get('REDIS_HOST') || 'localhost'}:6379`,
        },
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    EmailModule,
    VideosModule,
    CommentsModule,
    CloudinaryModule,
  ],
})
export class AppModule {}
