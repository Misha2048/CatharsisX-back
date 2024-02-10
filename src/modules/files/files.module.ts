import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { HttpModule } from '@nestjs/axios';
import { StillagesModule } from 'src/modules/stillages/stillages.module';

@Module({
  imports: [HttpModule, StillagesModule],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
