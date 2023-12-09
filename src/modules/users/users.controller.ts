import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/guards';
import { UsersService } from './users.service';
import { UserResponseDto } from 'src/dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Get User data',
    type: UserResponseDto,
    isArray: false,
  })
  @UseGuards(AccessTokenGuard)
  @Get('me')
  async getMe(@Request() req): Promise<any> {
    return new UserResponseDto(req.user);
  }
}
