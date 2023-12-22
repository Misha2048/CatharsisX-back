import { Module } from '@nestjs/common';
import { ShelfsService } from './shelfs.service';
import { ShelfsController } from './shelfs.controller';

@Module({
  controllers: [ShelfsController],
  providers: [ShelfsService]
})
export class ShelfsModule {}
