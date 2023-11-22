import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { openStdin } from 'process';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    sendMail(opts: {
        to: string,
        subject: string,
        html: string
    }) {
        this.mailerService.sendMail({
            ...opts,
            from: process.env.EMAIL_USER, 
        });
    }
}
