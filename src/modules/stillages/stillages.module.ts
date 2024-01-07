import { Module } from '@nestjs/common';
import { StillagesController } from './stillages.controller';
import { StillagesService } from './stillages.service';

@Module({
  controllers: [StillagesController],
  providers: [StillagesService],
  exports: [StillagesService],
})
export class StillagesModule {}
