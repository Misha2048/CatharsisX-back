import { Controller, Get, UseGuards, Request, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/guards';
import { EmailVerifyService } from './email-verify.service';

@ApiTags('Email Verification')
@Controller('email-verify')
export class EmailVerifyController {
    constructor(
        private readonly emailVerifyService: EmailVerifyService,
    ) {}

    @ApiBearerAuth()
    @UseGuards(AccessTokenGuard)
    @Get()
    async sendVerificationLetter(@Request() req) {
        this.emailVerifyService.sendVerificationLetter(req.user['id'], req.user['email']);
    }

    @Get(':id')
    async verify(@Res() res: Response, @Param('id') id: string) {
        return res.status(303).redirect(await this.emailVerifyService.verify_email(id));
    }
}
