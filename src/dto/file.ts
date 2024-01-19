import { ApiProperty } from '@nestjs/swagger';

export class UploadFileRequest {
  @ApiProperty()
  filename: string;

  @ApiProperty()
  file_size: number;

  @ApiProperty()
  content: Buffer;

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
