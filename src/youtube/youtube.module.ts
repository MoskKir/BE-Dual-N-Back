import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { YoutubeService } from './youtube.service';
import { YoutubeController } from './youtube.controller';
import { JobsModule } from '../jobs/jobs.module';

@Module({
  imports: [ScheduleModule.forRoot(), JobsModule],
  providers: [YoutubeService],
  controllers: [YoutubeController],
})
export class YoutubeModule {}
