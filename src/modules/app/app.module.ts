import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from '../mail/mail.module';
import { EmailVerifyModule } from '../email-verify/email-verify.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    MailModule,
    EmailVerifyModule,
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
