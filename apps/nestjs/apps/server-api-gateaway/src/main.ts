import { NestFactory } from '@nestjs/core';
import { ServerApiGateawayModule } from './server-api-gateaway.module';

async function bootstrap() {
  const app = await NestFactory.create(ServerApiGateawayModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
