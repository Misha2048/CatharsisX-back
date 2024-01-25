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

      if (fileType === 'pdf') {
        try {
          parsedText = (
            await officeParser.parseOfficeAsync(file.buffer)
          ).trim();
        } catch (error) {
          this.logger.error(`Failed to parse pdf file: ${error.message}`);
          throw new HttpException(
            'Failed to parse pdf file!',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      } else if (fileType === 'docx') {
        try {
          parsedText = await officeParser.parseOfficeAsync(file.buffer);
        } catch (error) {
          this.logger.error(`Failed to parse docx file: ${error.message}`);
          throw new HttpException(
            'Failed to parse docx file!',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      } else if (fileType === 'xlsx') {
        try {
          parsedText = await officeParser.parseOfficeAsync(file.buffer);
        } catch (error) {
          this.logger.error(`Failed to parse xlsx file: ${error.message}`);
          throw new HttpException(
            'Failed to parse xlsx file!',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      } else if (fileType === 'rtf') {
        try {
          parseRTF.string(file.buffer, function (err, doc) {
            if (err) throw err;
            parsedText = '';
            doc.content.forEach(function (element) {
              if (element.content && element.content.length > 0) {
                element.content.forEach(function (innerElement) {
                  if (innerElement.value) {
                    parsedText += innerElement.value;
                  }
                });
              }
            });
          });
        } catch (error) {
          this.logger.error(`Failed to parse rtf file: ${error.message}`);
          throw new HttpException(
            'Failed to parse rtf file!',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      } else if (fileType === 'txt') {
        try {
          const txtData = await file.buffer.toString('utf-8');
          parsedText = txtData;
        } catch (error) {
          this.logger.error(`Failed to parse txt file: ${error.message}`);
          throw new HttpException(
            'Failed to parse txt file!',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      } else if (fileType === 'pptx') {
        try {
          parsedText = await officeParser.parseOfficeAsync(file.buffer);
        } catch (error) {
          this.logger.error(`Failed to parse pptx file: ${error.message}`);
          throw new HttpException(
            'Failed to parse pptx file!',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
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
