import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from "path"

async function bootstrap() {
  const port = 7000;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  await app.listen(port);
  console.log('Running at port: ', port);
  if (process.env.ENABLE_LOGGING?.toLowerCase() != 'true') {
    console.log = function () { };
  }
}
bootstrap();
