import { ValidationPipe } from '@nestjs/common';

export const queryValidationPipeline = new ValidationPipe({
  transform: true,
  transformOptions: { enableImplicitConversion: true },
  forbidNonWhitelisted: false,
  whitelist: true,
});
