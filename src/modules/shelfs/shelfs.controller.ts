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
  Delete,
  UnprocessableEntityException,
  Post,
} from '@nestjs/common';
import { ShelfsService } from './shelfs.service';
import {
  CreateShelfBadRequestError,
  CreateShelfNotFoundError,
  CreateShelfRequestDto,
  DeleteShelfResponseDto,
  FindShelfsRequestDto,
  FindShelfsResponseDto,
  GetShelvesResponseDto,
  UpdateShelfRequestDto,
  UpdateShelfResponseDto,
} from 'src/dto/shelfs';
import { AccessTokenGuard } from 'src/guards';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { StillagesService } from '../stillages/stillages.service';
import { queryValidationPipeline } from 'src/pipelines/queryValidationPipeline';

@ApiTags('Shelfs')
@Controller('shelfs')
export class ShelfsController {
  constructor(
    private readonly shelfsService: ShelfsService,
    private readonly stillageService: StillagesService,
  ) {}

  @ApiOkResponse({
    description: 'Search Shelfs ',
    type: GetShelvesResponseDto,
    isArray: false,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get()
  async findShelfs(
    @Query() findShelfsRequestDto: FindShelfsRequestDto,
    @Request() req,
  ) {
    if (!findShelfsRequestDto.stillage) {
      throw new UnprocessableEntityException(
        'Stillage is required in the query.',
      );
    }

    const stillage = await this.stillageService.findStillageById(
      findShelfsRequestDto.stillage,
    );

    if (!stillage || (stillage.private && stillage.userId != req.user['id'])) {
      throw new NotFoundException('Stillage not found');
    }

    const shelfs = await this.shelfsService.findShelfs(findShelfsRequestDto);

    return {
      stillageName: stillage.name,
      stillageUserId: stillage.userId,
      findShelfsResponse: shelfs,
    };
  }

  @ApiOkResponse({
    description: 'Updating Shelf model fields',
    type: UpdateShelfResponseDto,
    isArray: false,
  })
  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  async updateShelf(
    @Param('id') id: string,
    @Body(queryValidationPipeline) updateShelfRequest: UpdateShelfRequestDto,
    @Request() req,
    @Res() res,
  ) {
    // Checking is new stillage id belong to the user by its id
    if (updateShelfRequest.stillage) {
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
      if (value !== undefined) {
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

  @ApiOkResponse({
    description: 'Delete Shelfs',
    type: DeleteShelfResponseDto,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async deleteShelfs(@Param('id') id: string, @Request() req) {
    await this.shelfsService.deleteShelfs(id, req.user['id']);
    return new DeleteShelfResponseDto(
      'Shelf and related files deleted successfully',
    );
  }

  @ApiOkResponse({
    description: 'A new shelf',
    type: FindShelfsResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad request response',
    type: CreateShelfBadRequestError,
  })
  @ApiNotFoundResponse({
    description: 'Not found response',
    type: CreateShelfNotFoundError,
  })
  @UseGuards(AccessTokenGuard)
  @Post()
  async createShelf(
    @Body(queryValidationPipeline) createShelfRequest: CreateShelfRequestDto,
    @Request() req,
  ) {
    const stillage = await this.stillageService.findStillageById(
      createShelfRequest.stillage,
      req.user['id'],
    );

    if (!stillage) {
      throw new NotFoundException(
        "Stillage not found or it doesn't belong to user",
      );
    }

    const shelf = await this.shelfsService.createShelf(
      createShelfRequest,
      req.user['id'],
    );

    return new FindShelfsResponseDto(shelf);
  }
}
