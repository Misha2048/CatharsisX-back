import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
  Patch,
  Param,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import {
  CreateCommentRequestDto,
  CreateCommentResponseDto,
  UpdateCommentRequestDto,
  UpdateCommentResponseDto,
} from 'src/dto/comment';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/guards';
import { queryValidationPipeline } from 'src/pipelines/queryValidationPipeline';
import { HTTPError } from 'src/dto/common';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOkResponse({
    description: 'Create Comment',
    type: CreateCommentResponseDto,
    isArray: false,
  })
  @ApiBadRequestResponse({
    description: 'Failed create comment',
    type: HTTPError,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post()
  async createComment(
    @Body(queryValidationPipeline)
    createCommentRequestDto: CreateCommentRequestDto,
    @Request() req,
  ) {
    try {
      await this.commentService.createComment(
        createCommentRequestDto,
        req.user['id'],
      );
      return new CreateCommentResponseDto('Comment successfully created');
    } catch (error) {
      throw new HttpException(
        new HTTPError('Error creating comment: ' + error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiOkResponse({
    description: 'Update Comment',
    type: UpdateCommentResponseDto,
    isArray: false,
  })
  @ApiBadRequestResponse({
    description: 'Failed update comment',
    type: HTTPError,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  async updateComment(
    @Param('id') id: string,
    @Body(queryValidationPipeline)
    updateCommentRequestDto: UpdateCommentRequestDto,
    @Request() req,
  ) {
    try {
      return await this.commentService.updateComment(
        id,
        req.user['id'],
        updateCommentRequestDto,
      );
    } catch (error) {
      throw new HttpException(
        new HTTPError('Error update forums: ' + error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
