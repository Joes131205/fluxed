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

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('/time')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async updateSettings(
    @Request() req: any,
    @Body() body: UpdateSettingRequest,
  ) {
    try {
      await this.userService.updateSettings(req.userId as string, body);
      return { ok: true, message: 'Updated' };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }

  @Put('/')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async updateUser(@Request() req: any, @Body() body: UpdateUserRequest) {
    try {
      await this.userService.updateUser(req.userId as string, body);
      return { ok: true };
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes('not found')) {
        throw new NotFoundException('User not found');
      }
      throw new BadRequestException('Server Error');
    }
  }
}
