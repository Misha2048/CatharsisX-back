import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ShelfsService } from './shelfs.service';
import { FindShelfsRequestDto } from 'src/dto/shelfs';
import { AccessTokenGuard } from 'src/guards';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Shelfs')
@Controller('shelfs')
export class ShelfsController {
  constructor(private readonly shelfsService: ShelfsService) {}

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
}
