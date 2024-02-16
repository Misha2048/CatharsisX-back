import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  HttpException,
  HttpStatus,
  Get,
  Query,
  Patch,
  Param,
} from '@nestjs/common';
import { ForumService } from './forum.service';
import {
  CreateForumRequestDto,
  CreateForumSuccesResponseDto,
  FindForumsDto,
  FindForumsRequestDto,
  FindForumsResponseDto,
  HTTPError,
  UpdateForumRequestDto,
  UpdateForumResponseDto,
} from 'src/dto/forum';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/guards';
import { queryValidationPipeline } from 'src/pipelines/queryValidationPipeline';

@ApiTags('Forum')
@Controller('forum')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @ApiOkResponse({
    description: 'Create Forum',
    type: CreateForumSuccesResponseDto,
    isArray: false,
  })
  @ApiBadRequestResponse({
    description: 'Failed create forum',
    type: HTTPError,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post()
  async createForum(
    @Body(queryValidationPipeline) createForumRequestDto: CreateForumRequestDto,
    @Request() req,
  ) {
    try {
      await this.forumService.createForum(
        createForumRequestDto,
        req.user['id'],
      );
      return new CreateForumSuccesResponseDto('forum successfully created');
    } catch (error) {
      throw new HttpException(
        new HTTPError('Error creating forum: ' + error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiOkResponse({
    description: 'Find Forums',
    type: FindForumsResponseDto,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'Failed find forum',
    type: HTTPError,
  })
  @Get()
  async findForums(
    @Query(queryValidationPipeline)
    findForumRequestDto: FindForumsRequestDto,
  ): Promise<{ count: number; forums: FindForumsDto[] }> {
    try {
      return await this.forumService.findForums(findForumRequestDto);
    } catch (error) {
      throw new HttpException(
        new HTTPError('Error find forums' + error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiOkResponse({
    description: 'Update Forum',
    type: UpdateForumResponseDto,
    isArray: false,
  })
  @ApiBadRequestResponse({
    description: 'Failed update forum',
    type: HTTPError,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  async updateForum(
    @Param('id') id: string,
    @Body(queryValidationPipeline) updateForumRequestDto: UpdateForumRequestDto,
    @Request() req,
  ) {
    try {
      return await this.forumService.updateForum(
        id,
        req.user['id'],
        updateForumRequestDto,
      );
    } catch (error) {
      throw new HttpException(
        new HTTPError('Error update forums'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
