import { ApiProperty } from '@nestjs/swagger';
import { File } from '@prisma/client';

export class UploadFileRequest {
  @ApiProperty()
  file: Express.Multer.File;

  @ApiProperty()
  filename: string;

  @ApiProperty()
  shelf_id: string;
}

export class UploadFileErrorResponseDto {
  @ApiProperty()
  error: string;

  constructor(error: string) {
    this.error = error;
  }
}

export class UploadFileSuccessResponseDto {
  @ApiProperty()
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}

export class GetFilesRequestDto {
  @ApiProperty({ description: 'The shelf ID' })
  shelf: string;

  @ApiProperty({ description: 'The stillage ID' })
  stillage: string;
}

export class GetFilesResponseDto {
  constructor(file: File) {
    this.id = file.id;
    this.name = file.filename;
    this.size = file.size;
    this.uploadedAt = file.uploaded_at;
  }

  @ApiProperty({ description: 'The file ID' })
  id: string;

  @ApiProperty({ description: 'The file name' })
  name: string;

  @ApiProperty({ description: 'The size of a file in bytes', example: 1024 })
  size: number;

  @ApiProperty({ example: '2024-01-01T12:30:00.000' })
  uploadedAt: Date;
}
