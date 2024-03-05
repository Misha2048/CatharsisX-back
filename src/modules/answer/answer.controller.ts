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
  UpvoteAnswerRequestDto,
  UpvoteAnswerResponseDto,
} from 'src/dto/answer';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/guards';
import { HTTPError } from 'src/dto/forum';
import { queryValidationPipeline } from 'src/pipelines/queryValidationPipeline';

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
    @Body(queryValidationPipeline)
    createAnswerRequestDto: CreateAnswerRequestDto,
    @Request() req,
  ) {
    try {
      return await this.answerService.createAnswer(
        createAnswerRequestDto,
        req.user['id'],
      );
    } catch (error) {
      throw new HttpException(
        new HTTPError('Error creating forum: ' + error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiOkResponse({
    description: 'Upvote or downvote Answer',
    type: UpvoteAnswerResponseDto,
    isArray: false,
  })
  @ApiBadRequestResponse({
    description: 'Failed to upvote or downvote Answer',
    type: HTTPError,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Patch('upvote')
  async upvoteAnswer(
    @Body(queryValidationPipeline)
    upvoteAnswerRequestDto: UpvoteAnswerRequestDto,
    @Request() req,
  ) {
    try {
      await this.answerService.upvoteAnswer(
        req.user['id'],
        upvoteAnswerRequestDto,
      );
      return new UpvoteAnswerResponseDto(
        'Answer successfully upvoted or downvoted',
      );
    } catch (error) {
      throw new HttpException(
        new HTTPError('Error upvote answer: ' + error.message),
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
    @Body(queryValidationPipeline)
    updateAnswerRequestDto: UpdateAnswerRequestDto,
    @Request() req,
  ) {
    try {
      return await this.answerService.updateAnswer(
        id,
        req.user['id'],
        updateAnswerRequestDto,
      );
    } catch (error) {
      throw new HttpException(
        new HTTPError('Error update answer: ' + error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
