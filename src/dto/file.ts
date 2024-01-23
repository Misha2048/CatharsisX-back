import { ApiProperty } from '@nestjs/swagger';

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
