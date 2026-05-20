import { NestFactory } from '@nestjs/core';
import { CategoryModule } from './category.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(CategoryModule);
  const config = new DocumentBuilder()
    .setTitle('Fluxed API | User Service')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);
  await app.listen(3002);
}
bootstrap();
