import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { MailService } from './mail.service';
import { AddUniversityRequestDto } from 'src/dto';

@ApiTags('Mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @ApiOkResponse({
    description: 'New university proposal letter for adding to the admin',
    type: AddUniversityRequestDto,
    isArray: false,
  })
  @Post('new-university-letter')
  async sendNewUniversityProposalLetter(
    @Body() addUniversityRequest: AddUniversityRequestDto,
  ) {
    this.mailService.sendMail({
      to: process.env.EMAIL_ADMIN,
      subject: 'New Univerity Proposal',
      html: `<p style = "color: black;">A proposal for the new univerisity is <b>${addUniversityRequest.name}</b></p>`,
    });

    return { message: 'Your proposal has been sent to the admin.' };
  }
}
