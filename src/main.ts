import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'; // Import global exception filter
import 'reflect-metadata';

async function bootstrap() {
  // Create the NestJS application using the root module
  const app = await NestFactory.create(AppModule);

  // Apply security middleware `helmet` with default configurations
  app.use(
    helmet({
      contentSecurityPolicy: false, // Optional: Disable Content Security Policy if necessary
    }),
  );

  // Enable Cross-Origin Resource Sharing (CORS) for the app
  app.enableCors();

  // Set up global validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Automatically strip unallowed properties from the request
      forbidNonWhitelisted: true, // Reject requests with unknown properties
      transform: true, // Transform request payloads to match DTO types
    }),
  );

  // Register a global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Configure Swagger for API documentation
  const config = new DocumentBuilder()
    .setTitle('ToDo API') // API title
    .setDescription('API for managing ToDo lists and items') // API description
    .setVersion('1.0') // API version
    .addBearerAuth() // Add support for Bearer authentication
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger UI available at `/api`

  // Start the application and listen on the defined port
  const port = process.env.PORT ?? 5000; // Default port is 5000 if not specified in environment variables
  await app.listen(port);

  // Log application and Swagger URLs
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger is running on: http://localhost:${port}/api`);
}

bootstrap();
