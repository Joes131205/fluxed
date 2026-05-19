import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'login' })
  login() {
    return this.appService.getHello();
  }

  @MessagePattern({ cmd: 'register' })
  register() {
    return this.appService.getHello();
  }

  @MessagePattern({ cmd: 'getMe' })
  getMe() {
    return this.appService.getHello();
  }
}
