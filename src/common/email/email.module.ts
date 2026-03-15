import { Global, Module } from '@nestjs/common';
import { config } from 'dotenv';
import { EmailService } from './email.service';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
config();
@Global()
@Module({
  providers: [EmailService,],
  exports: [EmailService],
  imports:[MailerModule]
})
export class EmailModule {}
