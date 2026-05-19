import { Injectable } from '@nestjs/common';

@Injectable()
export class ServerApiGateawayService {
  getHello(): string {
    return 'Hello World!';
  }
}
