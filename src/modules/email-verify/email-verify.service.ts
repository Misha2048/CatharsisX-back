import { Injectable } from '@nestjs/common';
import { EmailVerify } from '@prisma/client';
import client from 'src/db/prismaClient';
import { MailService } from '../mail/mail.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class EmailVerifyService {
  constructor(
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
  ) {}

  async create(userId: string): Promise<EmailVerify> {
    return await client.emailVerify.create({
      data: {
        user: userId,
      },
    });
  }

  async findById(id: string): Promise<EmailVerify> {
    return await client.emailVerify.findFirst({
      where: {
        id,
      },
    });
  }

  async findByUserId(user: string): Promise<EmailVerify> {
    return await client.emailVerify.findFirst({
      where: {
        user,
      },
    });
  }

  async deleteById(id: string): Promise<EmailVerify> {
    return await client.emailVerify.delete({
      where: {
        id,
      },
    });
  }

  async sendVerificationLetter(userId: string, email: string): Promise<void> {
    const user = await this.usersService.findById(userId);
    if (user.email_verified) {
      return;
    }
    let emailVerify = await this.findByUserId(userId);
    if (!emailVerify) {
      emailVerify = await this.create(userId);
    }

    const url = `${process.env.EMAIL_HOST}/email-verify/${emailVerify.id}`;

    this.mailService.sendMail({
      to: email,
      subject: 'Verify email address',
      html: `To verify your email click here: <a href="${url}">${url}</a>`,
    });
  }

  async verify_email(userId: string): Promise<string> {
    const emailVerify = await this.findById(userId);
    if (!emailVerify) {
      return process.env.EMAIL_VERIFY_CALLBACK_URL;
    }

    await this.usersService.update(emailVerify.user, { email_verified: true });
    await this.deleteById(emailVerify.id);

    return process.env.EMAIL_VERIFY_CALLBACK_URL;
  }
}
