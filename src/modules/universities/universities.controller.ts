import { Controller, Get } from '@nestjs/common';
import { UniversitiesService } from './universities.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetUniversitiesResponseDto } from 'src/dto';

@ApiTags('Universities')
@Controller('universities')
export class UniversitiesController {
  constructor(private readonly universityService: UniversitiesService) {}

  @ApiOkResponse({
    description: 'Universities list response to the frontend',
    type: GetUniversitiesResponseDto,
    isArray: true,
  })
  @Get()
  async findUniversities() {
    const universities = await this.universityService.findUniversities();
    const getUniversitiesResponse: GetUniversitiesResponseDto[] = [];

    for (const university of universities) {
      getUniversitiesResponse.push(new GetUniversitiesResponseDto(university));
    }

    return getUniversitiesResponse;
  }
}
