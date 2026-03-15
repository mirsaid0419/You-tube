import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class EmailService {
  constructor(
    private readonly emailService: MailerService,
    private readonly config: ConfigService,
  ) {}
  async sendOtpEmail(email: string, password: string) {
    try {
      await this.emailService.sendMail({
        to: email,
        from: this.config.get<string>('EMAIL_USER'),
        subject: `You tub tizimidan foydalanish uchun tasdiqlash kodi`,
        html: `<p>Tizimga kirish uchun tasdiqlash kodi:</p>
            <p><b>Parol:</b> ${password}</p>`,
      });
      return { success: true };
    } catch (error) {
      console.error('Email yuborishda xatolik:', error);
      throw new Error('Email yuborish tizimida xatolik yuz berdi');
    }
  }
}
