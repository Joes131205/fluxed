import { NestFactory } from '@nestjs/core';
import { CategoryModule } from './category.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(CategoryModule);

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Fluxed API | Category Service')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(3001);
}
bootstrap();
