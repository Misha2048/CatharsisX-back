import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, MailerModule.forRoot({
    transport: {
      host: 'smtp.gmail.com',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    }
  })],
  providers: [MailService],
  controllers: [MailController],
  exports: [MailService]
})
export class MailModule {}
