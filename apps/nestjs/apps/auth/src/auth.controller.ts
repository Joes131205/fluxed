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
  HttpCode,
  Res,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequest, RegisterRequest } from './dto/auth.dto';
import { JwtAuthGuard } from 'packages/shared/guard/jwt.guard';
import type { Response } from 'express';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @HttpCode(201)
  async register(@Body() body: RegisterRequest) {
    try {
      const result = await this.authService.register(body);
      return { ok: true, ...result };
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes('Email already exists')) {
        throw new ConflictException('Email already exists');
      }
      throw new BadRequestException('Server Error');
    }
  }

  @Post('/login')
  @HttpCode(200)
  async login(@Body() body: LoginRequest) {
    try {
      const result = await this.authService.login(body);
      return { ok: true, ...result };
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Invalid Credentials');
    }
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async getMe(@Req() req) {
    try {
      const result = await this.authService.getMe(req.userId);
      return { ok: true, ...result };
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('User not found');
    }
  }

  @Get('/google/start')
  @HttpCode(307)
  startGoogleAuth(@Query('state') state?: string, @Res() res?: Response) {
    try {
      const result = this.authService.startGoogleAuth(state);
      if (res) {
        res.redirect(result.url);
      }
      return result;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }

  @Get('/google/callback')
  @HttpCode(307)
  async callbackGoogleAuth(
    @Query('code') code?: string,
    @Query('state') state?: string,
    @Query('error') error?: string,
    @Query('error_description') errorDescription?: string,
    @Res() res?: Response,
  ) {
    try {
      if (error) {
        return res?.json({ ok: false, error: errorDescription ?? error });
      }
      const result = await this.authService.callbackGoogleAuth(
        code,
        state,
        error,
        errorDescription,
      );
      if (res) {
        res.redirect(result.url);
      }
      return result;
    } catch (err: any) {
      console.error(err);
      return res?.status(400).json({ ok: false, error: err.message });
    }
  }
}
