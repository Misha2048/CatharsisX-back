import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { UploadFileRequest } from 'src/dto/file';
import client from 'src/db/prismaClient';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  constructor(private readonly httpService: HttpService) {}

  async validateFile(content: Buffer): Promise<boolean> {
    try {
      if (!process.env.VALIDATE_FILES) {
        return true;
      }

      const { data } = await firstValueFrom(
        this.httpService
          .post(
            'http://127.0.0.1:8000/validate/file/',
            { text: content.toString() },
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
      const isValid = await this.validateFile(file.buffer);

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
          text_content: file.buffer.toString('utf-8'),
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
