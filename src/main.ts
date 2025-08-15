import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Increase default body size limits so multipart/form-data and larger JSON bodies don't return 413
  app.use(express.json({ limit: process.env.REQUEST_JSON_LIMIT || '10mb' }));
  app.use(
    express.urlencoded({
      limit: process.env.REQUEST_URLENCODED_LIMIT || '10mb',
      extended: true,
    }),
  );

  // Enable CORS for frontend connection
  const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : [
        'http://localhost:3001',
        'http://localhost:3000',
        'https://agronetapp.netlify.app/',
      ]; // Frontend ports

  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`AgroNet API is running on ${port}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start the application:', error);
  process.exit(1);
});
