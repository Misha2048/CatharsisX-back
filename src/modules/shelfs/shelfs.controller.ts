import { Controller, Get, Query, UseGuards, Request, Patch, Param, Body, NotFoundException } from '@nestjs/common';
import { ShelfsService } from './shelfs.service';
import { FindShelfsRequestDto, UpdateShelfRequestDto, UpdateShelfResponseDto } from 'src/dto/shelfs';
import { AccessTokenGuard } from 'src/guards';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { IShelfUpdateError } from '../../interfaces/IShelf';

@ApiTags('Shelfs')
@Controller('shelfs')
export class ShelfsController {
  constructor(private /* readonly */ shelfsService: ShelfsService) {}

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
  async updateShelf(@Param('id') id: string, @Body() updateShelfRequest: UpdateShelfRequestDto, @Request() req){
    const opts = {};

    for(const [key, value] of Object.entries(updateShelfRequest)){
      if (value !== undefined || value !== null){
        opts[key] = value;
      }
    }

    const shelf = await this.shelfsService.updateShelfs(id, req.user['id'], opts);
    
    if(this.instanceOfUpdateShelfError(shelf)){
      console.log("Error message:" + shelf.error_message);
      throw new NotFoundException('Shelf not found (check terminal for more detailed information)');
    }

    return new UpdateShelfResponseDto(shelf);
  }

  instanceOfUpdateShelfError(object: any): object is IShelfUpdateError{
    return 'error_message' in object;
  }
}