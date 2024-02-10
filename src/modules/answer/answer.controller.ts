import {
  Controller,
  Post,
  Body,
  Request,
  HttpException,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { AnswerService } from './answer.service';
import {
  CreateAnswerRequestDto,
  CreateAnswerResponseDto,
  HTTPError,
} from 'src/dto/answer';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/guards';

@ApiTags('Answer')
@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @ApiOkResponse({
    description: 'Create Answer',
    type: CreateAnswerResponseDto,
    isArray: false,
  })
  @ApiBadRequestResponse({
    description: 'Failed create answer',
    type: HTTPError,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post()
  async createAnswer(
    @Body() createAnswerRequestDto: CreateAnswerRequestDto,
    @Request() req,
  ) {
    try {
      await this.answerService.createAnswer(
        createAnswerRequestDto,
        req.user['id'],
      );
      return new CreateAnswerResponseDto('Answer successfully created');
    } catch (error) {
      throw new HttpException(
        new HTTPError('Error creating forum: ' + error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
