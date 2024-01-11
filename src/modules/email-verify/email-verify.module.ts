import { Module } from '@nestjs/common';
import { EmailVerifyService } from './email-verify.service';
import { EmailVerifyController } from './email-verify.controller';
import { MailModule } from '../mail/mail.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [MailModule, UsersModule],
  providers: [EmailVerifyService],
  exports: [EmailVerifyService],
  controllers: [EmailVerifyController],
})
export class EmailVerifyModule {}
