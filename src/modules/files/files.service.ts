import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { UploadFileRequest } from 'src/dto/file';
import client from 'src/db/prismaClient';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import * as officeParser from 'officeparser';
import * as parseRTF from 'rtf-parser';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  constructor(private readonly httpService: HttpService) {}

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
  ): Promise<void> {
    try {
      const fileType = file.originalname.split('.').pop().toLowerCase();

      let parsedText;

      try {
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
      } catch (error) {
        const errorMessage = `Failed to parse ${fileType} file: ${error.message}`;
        this.logger.error(errorMessage);
        throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const isValid = await this.validateFile(parsedText);

      if (!isValid) {
        this.logger.error('Validation failed. File not uploaded.');
        throw new HttpException('Invalid file!', HttpStatus.BAD_REQUEST);
      }

      const shelf = await client.shelf.findUnique({
        where: { id: uploadFileRequest.shelf_id },
      });

      await client.file.create({
        data: {
          filename: uploadFileRequest.filename,
          text_content: parsedText,
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
    } catch (error) {
      this.logger.error(`Failed to upload file to shelf: ${error.message}`);
      throw new HttpException(
        'Failed to upload file to shelf!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
