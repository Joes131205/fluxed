import {
  BadRequestException,
  Body,
  Controller,
  Put,
  Request,
  UseGuards,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateSettingRequest, UpdateUserRequest } from '../user/user.dto';
import { JwtAuthGuard } from 'packages/shared/guard/jwt.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('/time')
  @ApiOperation({ summary: "Update the user's setting" })
  @ApiBearerAuth()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async updateSettings(
    @Request() req: any,
    @Body() body: UpdateSettingRequest,
  ) {
    await this.userService.updateSettings(req.user.userId, body);
    return { ok: true, message: 'Updated' };
  }

  @Put('/')
  @ApiOperation({ summary: 'Update user' })
  @ApiBearerAuth()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async updateUser(@Request() req: any, @Body() body: UpdateUserRequest) {
    await this.userService.updateUser(req.user.userId, body);
    return { ok: true };
  }
}
