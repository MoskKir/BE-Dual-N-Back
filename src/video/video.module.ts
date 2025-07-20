import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { Video } from '../models/video/video.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Video])],
  providers: [VideoService],
  controllers: [VideoController],
  exports: [VideoService],
})
export class VideoModule {}
