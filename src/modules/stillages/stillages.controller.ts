import { NotFoundException, Body, Param, Controller, Patch, Req, UseGuards} from '@nestjs/common';
import { UpdateStillageRequestDto, UpdateStillageResponseDto } from 'src/dto/stillages';
import { AccessTokenGuard } from 'src/guards';
import { StillagesService } from './stillages.service';
import { Request } from 'express';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Stillages')
@Controller('stillages')
export class StillagesController {
    constructor(private stillagesService: StillagesService){}

    @ApiOkResponse({
        description: 'Updating Stillage model fields',
        type: UpdateStillageRequestDto,
        isArray: false,
    })

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    async update(@Param('id') id: string, @Body() updateStillageRequest: UpdateStillageRequestDto, @Req() req: Request){
        const opts = {}
        for(const [key, value] of Object.entries(updateStillageRequest)){
            if(value !== undefined || value !== null){
                opts[key] = value;
            }
        }
        const stillage = await this.stillagesService.updateStillage(id, req.user['id'], opts);
        if (!stillage){
            throw new NotFoundException('Stillage not found');
        }
        return new UpdateStillageResponseDto(stillage);
    };
}