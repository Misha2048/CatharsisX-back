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
} from '@nestjs/common';
import { ForumService } from './forum.service';
import {
  CreateForumErrorResponseDto,
  CreateForumRequestDto,
  CreateForumSuccesResponseDto,
  FindForumsRequestDto,
  FindForumsResponseDto,
} from 'src/dto/forum';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/guards';

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
    type: CreateForumErrorResponseDto,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post()
  async createForum(
    @Body() createForumRequestDto: CreateForumRequestDto,
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
        new CreateForumErrorResponseDto('Error creating forum'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiOkResponse({
    description: 'Find Forums',
    type: FindForumsResponseDto,
    isArray: true,
  })
  @Get()
  async findForums(
    @Query() findForumRequestDto: FindForumsRequestDto,
  ): Promise<FindForumsResponseDto[]> {
    return await this.forumService.findForums(findForumRequestDto);
  }
}
