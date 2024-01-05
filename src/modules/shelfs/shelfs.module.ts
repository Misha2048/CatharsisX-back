import { Module } from '@nestjs/common';
import { ShelfsService } from './shelfs.service';
import { ShelfsController } from './shelfs.controller';
import { StillagesModule } from '../stillages/stillages.module';

@Module({
  controllers: [ShelfsController],
  providers: [ShelfsService],
  imports: [StillagesModule],
})
export class ShelfsModule {}
