import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';
import { CommonModule } from '../common/common.module';
import { CommonService } from '../common/common.service';

@Module({
  imports: [CommonModule],
  controllers: [CatalogController],
  providers: [CatalogService, CommonService],
})
export class CatalogModule {}
