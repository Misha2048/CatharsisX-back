import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Get,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { FilesService } from 'src/modules/files/files.service';
import {
  GetFilesRequestDto,
  GetFilesResponseDto,
  UploadFileErrorResponseDto,
  UploadFileRequest,
  UploadFileSuccessResponseDto,
} from 'src/dto/file';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/guards';
import { Request } from 'express';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload File to Shelf' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiOkResponse({
    description: 'File uploaded',
    type: UploadFileSuccessResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Failed to upload file',
    type: UploadFileErrorResponseDto,
  })
  @Post('upload')
  async uploadFileToShelf(
    @Body() uploadFileRequest: UploadFileRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      await this.filesService.uploadFileToShelf(uploadFileRequest, file);
      return new UploadFileSuccessResponseDto('File uploaded ');
    } catch (error) {
      throw new BadRequestException(
        new UploadFileErrorResponseDto(error.message),
      );
    }
  }

  @ApiOkResponse({
    description:
      'A list of files on a certain shelf (see GetFilesResponseDto for more details)',
    type: GetFilesResponseDto,
    isArray: true,
  })
  @UseGuards(AccessTokenGuard)
  @Get()
  async getFiles(
    @Query() getFilesDto: GetFilesRequestDto,
    @Req() req: Request,
  ) {
    return this.filesService.getFilesFromShelf(getFilesDto, req.user['id']);
  }
}
