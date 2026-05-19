import { Module } from '@nestjs/common';
import { ServerApiGateawayController } from './server-api-gateaway.controller';
import { ServerApiGateawayService } from './server-api-gateaway.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule],
  controllers: [ServerApiGateawayController],
  providers: [ServerApiGateawayService],
})
export class ServerApiGateawayModule {}
