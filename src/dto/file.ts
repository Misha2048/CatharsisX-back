import { ApiProperty } from '@nestjs/swagger';
import { IFile } from 'src/interfaces/IFile';

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

export class UploadFileResponseDto {
  constructor(file: IFile) {
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

export class GetFilesRequestDto {
  @ApiProperty({ description: 'The shelf ID' })
  shelf: string;
}

export class GetFilesResponseDto {
  constructor(file: IFile) {
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
