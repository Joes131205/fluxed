import {
  BadRequestException,
  Body,
  Controller,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateSettingRequest, UpdateUserRequest } from '../user/user.dto';
import { JwtAuthGuard } from 'packages/shared/guard/jwt.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('/time')
  @UseGuards(JwtAuthGuard)
  updateSettings(@Request() req: any, @Body() body: UpdateSettingRequest) {
    try {
      return this.userService.updateSettings(req.userId as string, body);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }

  @Put('/')
  @UseGuards(JwtAuthGuard)
  async updateUser(@Request() req: any, @Body() body: UpdateUserRequest) {
    try {
      return await this.userService.updateUser(req.userId as string, body);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }
}
