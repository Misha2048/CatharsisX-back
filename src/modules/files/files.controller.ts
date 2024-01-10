import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { UploadFileRequest } from 'src/dto/file';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileToShelf(
    @Body() uploadFileRequest: UploadFileRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      await this.filesService.uploadFileToShelf(uploadFileRequest, file);
      return { message: 'File uploaded ' };
    } catch (error) {
      return { error: 'Failed' };
    }
  }
}
