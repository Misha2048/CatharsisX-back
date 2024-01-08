import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { SignUpRequestDto, LoginRequestDto, TokensResponseDto } from 'src/dto';
import { AccessTokenGuard, RefreshTokenGuard } from 'src/guards';
import { AuthService } from './auth.service';
import { ForgotPasswordRequestDto, NewPasswordRequestDto } from 'src/dto/users';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOkResponse({
    description: 'Sign up the user and get their brand new tokens',
    type: TokensResponseDto,
    isArray: false,
  })
  @Post('signup')
  signup(@Body() createUserDto: SignUpRequestDto) {
    return this.authService.signUp(createUserDto);
  }

  @ApiOkResponse({
    description: 'Sign in the user and get their brand new tokens',
    type: TokensResponseDto,
    isArray: false,
  })
  @Post('login')
  signin(@Body() data: LoginRequestDto) {
    return this.authService.signIn(data);
  }

  @ApiBearerAuth()
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = req.user['id'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req: Request) {
    req.user;
    this.authService.logout(req.user['id']);
  }

  @Post('forgot-password')
  sendForgotPasswordLetter(
    @Body() forgotPasswordRequestDto: ForgotPasswordRequestDto,
  ) {
    return this.authService.sendForgotPasswordLetter(
      forgotPasswordRequestDto.email,
    );
  }

  @Post('new-password')
  setNewPassword(@Body() newPasswordRequestDto: NewPasswordRequestDto) {
    return this.authService.setNewPassword(
      newPasswordRequestDto.id,
      newPasswordRequestDto.password,
    );
  }
}
