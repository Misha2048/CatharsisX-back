import { Module } from '@nestjs/common';
import { StillagesController } from './stillages.controller';
import { StillagesService } from './stillages.service';
import { CommonModule } from '../common/common.module';
import { CommonService } from '../common/common.service';

@Module({
  imports: [CommonModule],
  controllers: [StillagesController],
  providers: [StillagesService, CommonService],
  exports: [StillagesService],
})
export class StillagesModule {}
