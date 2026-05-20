import { NestFactory } from '@nestjs/core';
import { PlannedSessionModule } from './planned-session.module';

async function bootstrap() {
  const app = await NestFactory.create(PlannedSessionModule);

  await app.listen(3004);
}
bootstrap();
