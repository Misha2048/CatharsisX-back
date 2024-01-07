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
