import {
  HttpStatus,
  Injectable,
  NestMiddleware,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { HTTPError } from 'src/dto/common';

@Injectable()
export class ErrorHandlingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction, error?: any) {
    if (!error) {
      next();
    } else if (error instanceof NotFoundException) {
      res
        .status(HttpStatus.NOT_FOUND)
        .json(new HTTPError(error.message, HttpStatus.NOT_FOUND));
    } else if (error instanceof ForbiddenException) {
      res
        .status(HttpStatus.FORBIDDEN)
        .json(new HTTPError(error.message, HttpStatus.FORBIDDEN));
    } else {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new HTTPError(
            'Internal Server Error',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  }
}
