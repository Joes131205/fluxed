import {
  Controller,
  Get,
  Post,
  BadRequestException,
  Body,
  UseGuards,
  Req,
  Query,
  Redirect,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequest, RegisterRequest } from './dto/auth.dto';
import { JwtAuthGuard } from 'packages/shared/guard/jwt.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  register(@Body() body: RegisterRequest) {
    try {
      return this.authService.register(body);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }

  @Post('/login')
  login(@Body() body: LoginRequest) {
    try {
      return this.authService.login(body);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req) {
    try {
      return this.authService.getMe(req.userId);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }

  @Get('/google/start')
  @Redirect()
  startGoogleAuth(@Query('state') state?: string) {
    try {
      return this.authService.startGoogleAuth(state);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }

  @Get('/google/callback')
  @Redirect()
  async callbackGoogleAuth(
    @Query('code') code?: string,
    @Query('state') state?: string,
    @Query('error') error?: string,
    @Query('error_description') errorDescription?: string,
  ) {
    try {
      return await this.authService.callbackGoogleAuth(
        code,
        state,
        error,
        errorDescription,
      );
    } catch (err) {
      console.error(err);
      throw new BadRequestException('Server Error');
    }
  }
}
