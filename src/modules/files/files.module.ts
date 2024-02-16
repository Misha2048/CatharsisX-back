import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { HttpModule } from '@nestjs/axios';
import { CommonService } from '../common/common.service';

@Module({
  imports: [HttpModule],
  controllers: [FilesController],
  providers: [FilesService, CommonService],
})
export class FilesModule {}
