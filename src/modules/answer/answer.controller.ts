import {
  Controller,
  Post,
  Body,
  Request,
  HttpException,
  UseGuards,
  HttpStatus,
  Patch,
  Param,
} from '@nestjs/common';
import { AnswerService } from './answer.service';
import {
  CreateAnswerRequestDto,
  CreateAnswerResponseDto,
  UpdateAnswerRequestDto,
  UpdateAnswerResponseDto,
} from 'src/dto/answer';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/guards';
import { HTTPError } from 'src/dto/forum';

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

  @ApiOkResponse({
    description: 'Update Answer',
    type: UpdateAnswerResponseDto,
    isArray: false,
  })
  @ApiBadRequestResponse({
    description: 'Failed update answer',
    type: HTTPError,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  async updateAnswer(
    @Param('id') id: string,
    @Body() updateAnswerRequestDto: UpdateAnswerRequestDto,
    @Request() req,
  ) {
    const opts = {};

    const validKeys = Object.keys(new UpdateAnswerRequestDto());

    for (const key of validKeys) {
      if (updateAnswerRequestDto[key] !== undefined) {
        opts[key] = updateAnswerRequestDto[key];
      }
    }
    try {
      return await this.answerService.updateAnswer(id, req.user['id'], opts);
    } catch (error) {
      throw new HttpException(
        new HTTPError('Error update answer: ' + error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
