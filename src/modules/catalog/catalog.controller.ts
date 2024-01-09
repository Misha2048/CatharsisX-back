import { Controller, Get, UseGuards, Query, Req } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/guards';
import { Request } from 'express';
import { GetCatalogRequestDto } from 'src/dto/catalog';

@ApiTags('Catalog')
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @ApiOkResponse({
    description: 'Get Catalog ',
    type: GetCatalogRequestDto,
    isArray: true,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get()
  async getCatalog(
    @Query() getCatalogRequestDto: GetCatalogRequestDto,
    @Req() req: Request,
  ) {
    return this.catalogService.getCatalog(getCatalogRequestDto, req.user['id']);
  }
}
