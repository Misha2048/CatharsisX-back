import { Controller, Get } from '@nestjs/common';
import { UniversitiesService } from './universities.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Universities')
@Controller('universities')
export class UniversitiesController {
  constructor(private readonly universityService: UniversitiesService) {}

  @ApiOkResponse({
    description: 'Universities list response to the frontend',
    type: String,
    isArray: true,
  })
  @Get()
  async findUniversities() {
    return await this.universityService.findUniversities();
  }
}
