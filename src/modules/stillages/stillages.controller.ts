import {
  NotFoundException,
  Body,
  Param,
  Controller,
  Patch,
  Req,
  UseGuards,
  Get,
  Query,
  Delete,
  Post,
} from '@nestjs/common';
import {
  CreateStillageRequestDto,
  CreateStillageResponseDto,
  DeleteStillageResponseDto,
  FindStillagesRequestDto,
  FindStillagesResponseDto,
  GetLikedStillagesRequestDTO,
  GetLikedStillagesResponseDto,
  UpdateStillageRequestDto,
  UpdateStillageResponseDto,
} from 'src/dto/stillages';
import { AccessTokenGuard } from 'src/guards';
import { StillagesService } from './stillages.service';
import { Request } from 'express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { queryValidationPipeline } from 'src/pipelines/queryValidationPipeline';
import { HTTPError } from 'src/dto/common';

@ApiTags('Stillages')
@Controller('stillages')
export class StillagesController {
  constructor(private stillagesService: StillagesService) {}

  @ApiOkResponse({
    description: 'Search Stillages ',
    type: FindStillagesResponseDto,
    isArray: true,
  })
  @Get()
  @UseGuards(AccessTokenGuard)
  async findStillages(
    @Query() findStillagesRequestDto: FindStillagesRequestDto,
    @Req() req: Request,
  ) {
    return this.stillagesService.findStillages(
      findStillagesRequestDto,
      req.user['id'],
    );
  }

  @ApiOkResponse({
    description:
      'Updating Stillage model fields. "private" field is for toggling a stillage\'s status (setting it private (true) or public (false))',
    type: UpdateStillageResponseDto,
    isArray: false,
  })
  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  async update(
    @Param('id') id: string,
    @Body(queryValidationPipeline)
    updateStillageRequest: UpdateStillageRequestDto,
    @Req() req: Request,
  ) {
    const opts = {};

    for (const [key, value] of Object.entries(updateStillageRequest)) {
      if (value !== undefined) {
        opts[key] = value;
      }
    }

    const stillage = await this.stillagesService.updateStillage(
      id,
      req.user['id'],
      opts,
    );

    if (!stillage) {
      throw new NotFoundException('Stillage not found');
    }

    return new UpdateStillageResponseDto(stillage);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Delete stillage and all content by id',
    type: DeleteStillageResponseDto,
    isArray: false,
  })
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async deleteStillage(@Param('id') id: string, @Req() req: Request) {
    await this.stillagesService.deleteStillage(id, req.user['id']);
    return { message: 'stillage deleted successfully' };
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Patch('like/:id')
  async toggleLikeStillage(@Param('id') id: string, @Req() req: Request) {
    return await this.stillagesService.toggleLikeStillage(id, req.user['id']);
  }

  @ApiOkResponse({
    description: 'Get liked stillages ',
    type: GetLikedStillagesResponseDto,
    isArray: false,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get('liked')
  async getLikedStillages(
    @Query() getLikedStillagesRequestDTO: GetLikedStillagesRequestDTO,
    @Req() req: Request,
  ) {
    return await this.stillagesService.getLikedStillages(
      getLikedStillagesRequestDTO,
      req.user['id'],
    );
  }

  @ApiOkResponse({
    description: 'Create stillage ',
    type: CreateStillageResponseDto,
    isArray: false,
  })
  @ApiBadRequestResponse({
    description: 'Failed create stillage',
    type: HTTPError,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post()
  async createStillage(
    @Body(queryValidationPipeline)
    createStillageRequestDto: CreateStillageRequestDto,
    @Req() req: Request,
  ) {
    return await this.stillagesService.createStillage(
      createStillageRequestDto,
      req.user['id'],
    );
  }
}
