import {
  Body,
  Controller,
  Put,
  Request,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AppService } from './app.service';
import { TimeRequest, UpdateUserRequest } from './dto/users.dto';
import { JwtAuthGuard } from './guards/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Put('/time')
  @UseGuards(JwtAuthGuard)
  async updateTime(@Body() body: TimeRequest, @Request() req: any) {
    try {
      const userId = req.user?.userId;
      await this.appService.updateSettings(userId, body);

      return { ok: true, message: 'Updated' };
    } catch (error) {
      throw new HttpException(
        { ok: false, error: 'Server Error' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('/')
  @UseGuards(JwtAuthGuard)
  async updateUser(@Body() body: UpdateUserRequest, @Request() req: any) {
    try {
      const userId = req.user?.userId;
      const updated = await this.appService.updateUser(userId, body);

      if (!updated) {
        throw new HttpException(
          { ok: false, error: 'Not found' },
          HttpStatus.NOT_FOUND,
        );
      }

      return { ok: true };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        { ok: false, error: 'Server Error' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
