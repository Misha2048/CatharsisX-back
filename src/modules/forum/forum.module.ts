import { Module } from '@nestjs/common';
import { ForumService } from './forum.service';
import { ForumController } from './forum.controller';
import { CommonService } from '../common/common.service';

@Module({
  controllers: [ForumController],
  providers: [ForumService, CommonService],
})
export class ForumModule {}
