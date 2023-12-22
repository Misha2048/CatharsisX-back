import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ShelfsService } from './shelfs.service';
import { FindShelfsRequestDto } from 'src/dto/shelfs';
import { AccessTokenGuard } from 'src/guards';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Shelfs')
@Controller('shelfs')
export class ShelfsController {
  constructor(private readonly shelfsService: ShelfsService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  async findShelfs(
    @Query() findShelfsRequestDto: FindShelfsRequestDto,
    @Request() req,
  ) {
    return this.shelfsService.findShelfs(findShelfsRequestDto, req.user['id']);
  }
}
