import { Injectable } from '@nestjs/common';
import client from './prismaClient';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
