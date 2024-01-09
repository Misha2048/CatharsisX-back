import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from '../mail/mail.module';
import { EmailVerifyModule } from '../email-verify/email-verify.module';
import { StillagesModule } from '../stillages/stillages.module';
import { ShelfsModule } from '../shelfs/shelfs.module';
import { MulterModule } from '@nestjs/platform-express';
import { FilesModule } from '../files/files.module';
import { CatalogModule } from '../catalog/catalog.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    MailModule,
    EmailVerifyModule,
    StillagesModule,
    ShelfsModule,
    ConfigModule.forRoot(),
    MulterModule.register({
      dest: './uploads',
    }),
    FilesModule,
    CatalogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
