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
} from '@nestjs/common';
import {
  FindStillagesRequestDto,
  UpdateStillageRequestDto,
  UpdateStillageResponseDto,
} from 'src/dto/stillages';
import { AccessTokenGuard } from 'src/guards';
import { StillagesService } from './stillages.service';
import { Request } from 'express';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Stillages')
@Controller('stillages')
export class StillagesController {
  constructor(private stillagesService: StillagesService) {}

  @ApiOkResponse({
    description: 'Search Stillages ',
    type: FindStillagesRequestDto,
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
      'Updating Stillage model fields. "property_status" field is for toggling a stillage\'s status (setting it private or public)',
    type: UpdateStillageResponseDto,
    isArray: false,
  })
  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  async update(
    @Param('id') id: string,
    @Body() updateStillageRequest: UpdateStillageRequestDto,
    @Req() req: Request,
  ) {
    const opts = {};

    if (updateStillageRequest.property_status === true) {
      const stillage = await this.stillagesService.findStillageById(
        id,
        req.user['id'],
      );

      if (!stillage) {
        throw new NotFoundException('Stillage not found');
      }

      opts['property_status'] =
        stillage.property_status === 'private' ? 'public' : 'private';
    }

    for (const [key, value] of Object.entries(updateStillageRequest)) {
      if (key === 'property_status') {
        continue;
      } else if (value !== undefined || value !== null) {
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
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async deleteStillage(@Param('id') id: string, @Req() req: Request) {
    await this.stillagesService.deleteStillage(id, req.user['id']);
    return { message: 'stillage deleted successfully' };
  }
}
