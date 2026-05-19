import { Module } from '@nestjs/common';
import { ServerApiGateawayController } from './server-api-gateaway.controller';
import { ServerApiGateawayService } from './server-api-gateaway.service';

@Module({
  imports: [],
  controllers: [ServerApiGateawayController],
  providers: [ServerApiGateawayService],
})
export class ServerApiGateawayModule {}
