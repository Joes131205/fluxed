import { Controller, Get, Post, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  register() {
    try {
      return this.authService.register();
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }

  @Post('/login')
  login() {
    try {
      return this.authService.login();
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }

  @Get('/me')
  getMe() {
    try {
      return this.authService.getMe();
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }

  @Get('/google/start')
  startGoogleAuth() {
    try {
      return this.authService.startGoogleAuth();
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }

  @Get('/google/callback')
  callbackGoogleAuth() {
    try {
      return this.authService.callbackGoogleAuth();
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }
}
