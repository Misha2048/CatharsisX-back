import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class SignUpRequestDto {
  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class LoginRequestDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class UserResponseDto {
  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email_verified = user.email_verified;
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  email_verified: boolean;
}

export class TokensResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;
}

export class ForgotPasswordRequestDto {
  @ApiProperty()
  email: string;
}

export class NewPasswordRequestDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  password: string;
}
