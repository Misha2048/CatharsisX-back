import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { openStdin } from 'process';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(opts: { to: string; subject: string; html: string }) {
    try {
      await this.mailerService.sendMail({
        ...opts,
        from: process.env.EMAIL_USER,
      });
      console.log('Email sent successfully.');
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email.');
    }
  }
}
