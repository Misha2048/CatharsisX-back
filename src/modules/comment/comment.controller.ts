import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import {
  CreateCommentRequestDto,
  CreateCommentResponseDto,
  HTTPError,
} from 'src/dto/comment';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/guards';

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
    @Body() createCommentRequestDto: CreateCommentRequestDto,
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
}
