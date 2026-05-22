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
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Create an account' })
  @HttpCode(201)
  async register(@Body() body: RegisterRequest) {
    const result = await this.authService.register(body);
    return { ok: true, ...result };
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login' })
  @HttpCode(200)
  async login(@Body() body: LoginRequest) {
    const result = await this.authService.login(body);
    return { ok: true, ...result };
  }

  @Get('/me')
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async getMe(@Req() req) {
    console.log(req);
    const result = await this.authService.getMe(req.user.userId);
    return { ok: true, ...result };
  }

  @Get('/google/start')
  @ApiOperation({ summary: 'Start the google authentication (consent screen)' })
  @HttpCode(307)
  startGoogleAuth(@Query('state') state?: string, @Res() res?: Response) {
    const result = this.authService.startGoogleAuth(state);
    if (res) {
      res.redirect(result.url);
    }
    return result;
  }

  @Get('/google/callback')
  @ApiOperation({ summary: 'Validate the google authentication' })
  @HttpCode(307)
  async callbackGoogleAuth(
    @Query('code') code?: string,
    @Query('state') state?: string,
    @Query('error') error?: string,
    @Query('error_description') errorDescription?: string,
    @Res() res?: Response,
  ) {
    if (error) {
      if (res) {
        res.status(400).json({ ok: false, error: errorDescription ?? error });
      }
      return;
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
  }
}
