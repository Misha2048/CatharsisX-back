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
  BadRequestException,
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
    description: 'Updating Stillage model fields',
    type: UpdateStillageRequestDto,
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
    for (const [key, value] of Object.entries(updateStillageRequest)) {
      if (value !== undefined || value !== null) {
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

  @ApiOkResponse({
    description: "Updating Stillage's model property status",
    type: UpdateStillageResponseDto,
    isArray: false,
  })
  @Patch('property-status/:id')
  @UseGuards(AccessTokenGuard)
  async togglePropertyStatus(@Param('id') id: string, @Req() req: Request) {
    const stillage = await this.stillagesService.updatePropertyStatus(
      id,
      req.user['id'],
    );
    if (!stillage) {
      throw new BadRequestException('Could not update stillage');
    }
    return new UpdateStillageResponseDto(stillage);
  }
}
