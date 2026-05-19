import { Controller, Get } from '@nestjs/common';
import { ServerApiGateawayService } from './server-api-gateaway.service';

@Controller()
export class ServerApiGateawayController {
  constructor(private readonly serverApiGateawayService: ServerApiGateawayService) {}

  @Get()
  getHello(): string {
    return this.serverApiGateawayService.getHello();
  }
}
