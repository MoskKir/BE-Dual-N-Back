import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { VideoService } from './video.service';
import { User } from '../models/user/user.entity';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.videoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.videoService.findOne(Number(id));
  }

  @Post()
  create(@Body() user: User): Promise<User> {
    return this.videoService.create(user);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.videoService.remove(Number(id));
  }
}
