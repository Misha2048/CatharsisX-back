import { ApiProperty } from '@nestjs/swagger';
import { Stillage } from '@prisma/client';

export class UpdateStillageRequestDto {
  @ApiProperty({
    example:
      "'firstStillage' or 'secondStillage' or 'thirdStillage' or 'Test_stillage' or 'test stillage' etc. (string) (optional parameter)",
  })
  name?: string;

  @ApiProperty({
    example:
      'true (boolean)(private), false (boolean)(public) or nothing (this parameter is optional)',
  })
  private?: boolean;
}

export class FindStillagesRequestDto {
  @ApiProperty()
  name?: string;

  @ApiProperty()
  last_upload_at?: Date[];

  @ApiProperty()
  created_at?: Date[];
}

export class StillagesResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ default: '2024-01-01T00:00:00.000Z' })
  created_at: string;

  @ApiProperty({ default: '2024-01-01T00:00:00.000Z' })
  last_upload_at: string;

  @ApiProperty()
  university_id: string;

  @ApiProperty()
  private: boolean;

  @ApiProperty()
  color: string;
}

export class FindStillagesResponseDto {
  constructor(stillage: Stillage, liked: boolean) {
    this.id = stillage.id;
    this.name = stillage.name;
    this.created_at = stillage.created_at;
    this.last_upload_at = stillage.last_upload_at;
    this.university_id = stillage.university_id;
    this.private = stillage.private;
    this.liked = liked;
    this.color = stillage.color;
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ default: '2024-01-01T00:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ default: '2024-01-01T00:00:00.000Z' })
  last_upload_at: Date;

  @ApiProperty()
  university_id: string;

  @ApiProperty({ default: false })
  private: boolean;

  @ApiProperty()
  liked: boolean;

  @ApiProperty()
  color: string;
}

export class GetLikedStillagesRequestDTO {
  @ApiProperty()
  name?: string;

  @ApiProperty()
  last_upload_at?: Date[];

  @ApiProperty()
  created_at?: Date[];

  @ApiProperty()
  limit: number;

  @ApiProperty({ description: 'zero-based offset index' })
  offset: number;
}

export class LikedStillageDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  last_upload_at: Date;

  @ApiProperty()
  university_id: string;

  @ApiProperty()
  private: boolean;

  @ApiProperty({ default: true })
  liked: true;

  @ApiProperty()
  color: string;
}

export class GetLikedStillagesResponseDto {
  @ApiProperty({ default: 10 })
  count: number;

  @ApiProperty({
    isArray: true,
    type: LikedStillageDto,
  })
  likedStillages: LikedStillageDto[];
}

export class UpdateStillageResponseDto {
  constructor(stillage: Stillage) {
    this.id = stillage.id;
    this.name = stillage.name;
    this.created_at = stillage.created_at;
    this.last_upload_at = stillage.last_upload_at;
    this.private = stillage.private;
    this.color = stillage.color;
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  last_upload_at: Date;

  @ApiProperty({
    example: 'true (boolean)(private) / false (boolean)(public)',
  })
  private: boolean;

  @ApiProperty()
  color: string;
}

export class DeleteStillageResponseDto {
  @ApiProperty({
    example: 'stillage deleted successfully',
  })
  message: string;
}
