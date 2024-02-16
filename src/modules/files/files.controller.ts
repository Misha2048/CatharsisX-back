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
  Param,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FilesService } from 'src/modules/files/files.service';
import {
  GetFilesRequestDto,
  GetFilesResponseDto,
  UploadFileErrorResponseDto,
  UploadFileRequest,
  UploadFileResponseDto,
} from 'src/dto/file';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/guards';
import { Request, Response } from 'express';
import { queryValidationPipeline } from 'src/pipelines/queryValidationPipeline';
import { HTTPError } from 'src/dto/common';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload File to Shelf' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiOkResponse({
    description: 'File uploaded',
    type: UploadFileResponseDto,
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
      return await this.filesService.uploadFileToShelf(uploadFileRequest, file);
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

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get('download/:fileId')
  async downloadFile(
    @Param('fileId') fileId: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      return this.filesService.downloadFile(fileId, req.user['id'], res);
    } catch (error) {
      throw new HttpException(
        new HTTPError('Error download file: ' + error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
