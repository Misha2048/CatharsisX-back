import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FilesService } from './files.service';
import {
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
  @UseInterceptors(FileInterceptor('file'))
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
}
