import { NestFactory } from '@nestjs/core';
import { PlannedSessionModule } from './planned-session.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(PlannedSessionModule);

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Fluxed API | Planned Sessions Service')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(3002);
}
bootstrap();
