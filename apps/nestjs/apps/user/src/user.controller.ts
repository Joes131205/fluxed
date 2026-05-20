import {
  BadRequestException,
  Body,
  Controller,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateSettingRequest, UpdateUserRequest } from './dto/user.dto';
import { JwtAuthGuard } from 'packages/shared/guard/jwt.guard';

@Controller()
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
  updateUser(@Request() req: any, @Body() body: UpdateUserRequest) {
    try {
      return this.userService.updateUser(req.userId as string, body);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }
}
