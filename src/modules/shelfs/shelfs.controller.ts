import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  Patch,
  Param,
  Body,
  Res,
  ImATeapotException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ShelfsService } from './shelfs.service';
import {
  FindShelfsRequestDto,
  UpdateShelfRequestDto,
  UpdateShelfResponseDto,
} from 'src/dto/shelfs';
import { AccessTokenGuard } from 'src/guards';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { StillagesService } from '../stillages/stillages.service';

@ApiTags('Shelfs')
@Controller('shelfs')
export class ShelfsController {
  constructor(
    private readonly shelfsService: ShelfsService,
    private readonly stillageService: StillagesService,
  ) {}

  @ApiOkResponse({
    description: 'Search Shelfs ',
    type: FindShelfsRequestDto,
    isArray: true,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get()
  async findShelfs(
    @Query() findShelfsRequestDto: FindShelfsRequestDto,
    @Request() req,
  ) {
    return this.shelfsService.findShelfs(findShelfsRequestDto, req.user['id']);
  }

  @ApiOkResponse({
    description: 'Updating Shelf model fields',
    type: UpdateShelfRequestDto,
    isArray: false,
  })
  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  async updateShelf(
    @Param('id') id: string,
    @Body() updateShelfRequest: UpdateShelfRequestDto,
    @Request() req,
    @Res() res,
  ) {
    // Checking is new stillage id belong to the user by its id
    if (
      updateShelfRequest.stillage !== undefined &&
      updateShelfRequest.stillage !== null
    ) {
      const isStillageExist = await this.stillageService.findStillageById(
        updateShelfRequest.stillage,
        req.user['id'],
      );
      if (!isStillageExist) {
        throw new NotFoundException('Stillage not found');
      }
    }

    // Catching not empty fields of the updateShelfRequest (UpdateShelfRequestDto)
    // for an updating shelf's model
    const opts = {};
    for (const [key, value] of Object.entries(updateShelfRequest)) {
      if (value !== undefined || value !== null) {
        opts[key] = value;
      }
    }

    const shelf = await this.shelfsService.updateShelfs(
      id,
      req.user['id'],
      opts,
    );

    // Checking is everything fine with the shelf
    if (!shelf) {
      throw new BadRequestException('Could not update shelf');
    }

    // Checking is shelf contain an UpdateShelfError interface (error message)
    if (this.shelfsService.instanceOfUpdateShelfError(shelf)) {
      console.log(shelf.error_message);

      if (shelf.error_status_code) {
        return res.status(shelf.error_status_code).json({
          statusCode: shelf.error_status_code,
          message: shelf.error_user_message,
        });
      }

      // Additional error just in case previous catches haven't worked
      throw new ImATeapotException(
        'Something went wrong, we will fix it soon...',
      );
    }

    return res.json(new UpdateShelfResponseDto(shelf));
  }
}
