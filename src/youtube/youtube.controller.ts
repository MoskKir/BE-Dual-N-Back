import { Controller, Get, Query } from '@nestjs/common';
import { YoutubeService } from './youtube.service';

@Controller('youtube')
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Get('channel-info')
  async getChannelInfo(@Query('id') channelId: string) {
    return await this.youtubeService.getChannelInfo(channelId);
  }

  @Get('playlist-info')
  async getPlaylistInfo(@Query('id') uploadsPlaylistId: string) {
    return await this.youtubeService.getPlaylistItems(uploadsPlaylistId);
  }

  @Get('video-info')
  async getVideoInfo(@Query('ids') videoIds: string[]) {
    return await this.youtubeService.getVideosInfo(videoIds);
  }
}
