import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  GetFilesRequestDto,
  GetFilesResponseDto,
  UploadFileRequest,
  UploadFileResponseDto,
} from 'src/dto/file';
import client from 'src/db/prismaClient';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import * as officeParser from 'officeparser';
import * as parseRTF from 'rtf-parser';
import { Response } from 'express';
import { CommonService } from '../common/common.service';
import { HTTPError } from 'src/dto/common';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  constructor(
    private readonly httpService: HttpService,
    private readonly commonService: CommonService,
  ) {}

  async validateFile(parsedText: string): Promise<boolean> {
    try {
      if (!process.env.VALIDATE_FILES) {
        return true;
      }

      const { data } = await firstValueFrom(
        this.httpService
          .post(
            'http://127.0.0.1:8000/validate/file/',
            { text: parsedText },
            {
              headers: {
                'x-api-key': process.env.AI_API_KEY,
              },
            },
          )
          .pipe(
            catchError((error: AxiosError) => {
              if (error.response && error.response.data) {
                this.logger.error(
                  `Validation error: ${JSON.stringify(error.response.data)}`,
                );
              } else {
                this.logger.error(`Validation error: ${error.message}`);
              }

              throw new HttpException(
                'An error happened during file validation!',
                HttpStatus.INTERNAL_SERVER_ERROR,
              );
            }),
          ),
      );

      console.log(data);
      return data;
    } catch (error) {
      this.logger.error(`Failed to validate file: ${error.message}`);
      throw new HttpException(
        'Failed to validate file!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async uploadFileToShelf(
    uploadFileRequest: UploadFileRequest,
    file: Express.Multer.File,
  ): Promise<UploadFileResponseDto> {
    try {
      const fileType = file.originalname.split('.').pop().toLowerCase();

      let parsedText;

      try {
        if (file.size === 0) {
          parsedText = '';
        } else {
          if (
            fileType === 'pdf' ||
            fileType === 'docx' ||
            fileType === 'xlsx' ||
            fileType === 'pptx'
          ) {
            parsedText = (
              await officeParser.parseOfficeAsync(file.buffer)
            ).trim();
          } else if (fileType === 'rtf') {
            parsedText = await new Promise((resolve, reject) => {
              parseRTF.string(file.buffer, function (err, doc) {
                if (err) reject(err);
                let text = '';
                doc.content.forEach(function (element) {
                  if (element.content && element.content.length > 0) {
                    element.content.forEach(function (innerElement) {
                      if (innerElement.value) {
                        text += innerElement.value;
                      }
                    });
                  }
                });
                resolve(text);
              });
            });
          } else if (fileType === 'txt') {
            parsedText = file.buffer.toString('utf-8');
          } else {
            throw new Error(`Unsupported file type: ${fileType}`);
          }
        }
      } catch (error) {
        const errorMessage = `Failed to parse ${fileType} file: ${error.message}`;
        this.logger.error(errorMessage);
        throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const cleanedText = await this.commonService.sanitizeText(parsedText);

      let isValid = true;
      if (file.size !== 0) {
        isValid = await this.validateFile(parsedText);
      }

      if (!isValid) {
        this.logger.error('Validation failed. File not uploaded.');
        throw new HttpException('Invalid file!', HttpStatus.BAD_REQUEST);
      }

      const shelf = await client.shelf.findUnique({
        where: { id: uploadFileRequest.shelf_id },
      });

      const uploadFiles = await client.file.create({
        data: {
          filename: uploadFileRequest.filename,
          text_content: cleanedText,
          content: file.buffer,
          size: file.size,
          uploaded_at: new Date(),
          shelf: {
            connect: {
              id: uploadFileRequest.shelf_id,
            },
          },
          stillage: {
            connect: {
              id: shelf.stillageId,
            },
          },
        },
      });

      this.logger.log('File uploaded successfully.');
      return new UploadFileResponseDto(uploadFiles);
    } catch (error) {
      this.logger.error(`Failed to upload file to shelf: ${error.message}`);
      throw new HttpException(
        'Failed to upload file to shelf!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getFilesFromShelf(
    getFilesDto: GetFilesRequestDto,
    userId: string,
  ): Promise<GetFilesResponseDto[]> {
    if (!getFilesDto.shelf) {
      throw new UnprocessableEntityException(
        'The shelf id is required in the query',
      );
    }

    const shelf = await client.shelf.findUnique({
      select: {
        files: {
          select: { id: true, filename: true, size: true, uploaded_at: true },
        },
        stillage: true,
      },
      where: { id: getFilesDto.shelf },
    });

    if (!shelf) throw new NotFoundException('Shelf not found');

    const stillage = shelf.stillage;

    if (stillage.private && stillage.userId !== userId) {
      throw new BadRequestException('Stillage is private');
    }

    return shelf.files.map((file) => new GetFilesResponseDto(file));
  }

  async downloadFile(fileId: string, userId: string, res: Response) {
    try {
      const file = await client.file.findUnique({
        where: { id: fileId },
        include: { shelf: { select: { stillage: true } } },
      });

      if (!file || !file.content) {
        throw new NotFoundException('File not found');
      }

      const stillage = file.shelf.stillage;
      if (stillage.private && stillage.userId !== userId) {
        throw new ForbiddenException('Access forbidden');
      }

      const contentType = await this.commonService.getContentType(
        file.filename,
      );

      res.set('Content-Type', contentType);
      res.set('Content-Disposition', `attachment`);
      res.send(file.content);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          new HTTPError(error.message, HttpStatus.NOT_FOUND),
          HttpStatus.NOT_FOUND,
        );
      } else if (error instanceof ForbiddenException) {
        throw new HttpException(
          new HTTPError(error.message, HttpStatus.FORBIDDEN),
          HttpStatus.FORBIDDEN,
        );
      }
    }
  }
}
