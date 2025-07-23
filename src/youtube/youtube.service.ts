import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { JobsService } from '../jobs/jobs.service';
import * as dotenv from 'dotenv';

dotenv.config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

@Injectable()
export class YoutubeService {
  constructor(private readonly jobsService: JobsService) {}

  async getChannelInfo(channelId): Promise<any> {
    try {
      const channelResponse = await axios.get(
        'https://www.googleapis.com/youtube/v3/channels',
        {
          params: {
            part: 'contentDetails,snippet',
            id: channelId,
            key: YOUTUBE_API_KEY,
          },
        },
      );

      console.log('channelResponse: ', channelResponse);

      return channelResponse.data;
    } catch (error) {
      console.error('Ошибка запроса к YouTube:', error);
      throw error;
    }
  }

  async getPlaylistItems(
    uploadsPlaylistId: string,
    maxResults: number = 10,
  ): Promise<any> {
    try {
      const playlistResponse = await axios.get(
        'https://www.googleapis.com/youtube/v3/playlistItems',
        {
          params: {
            part: 'snippet',
            playlistId: uploadsPlaylistId,
            maxResults: maxResults,
            key: YOUTUBE_API_KEY,
          },
        },
      );

      return playlistResponse.data;
    } catch (error) {
      console.error('Ошибка запроса к YouTube:', error);
      throw error;
    }
  }

  async getVideosInfo(videoIds: string[]): Promise<any> {
    try {
      const array = [];
      if (!Array.isArray(videoIds)) {
        array.push(videoIds);
      } else {
        array.push(...videoIds);
      }

      const videosRes = await axios.get(
        'https://youtube.googleapis.com/youtube/v3/videos',
        {
          params: {
            part: 'snippet,contentDetails,statistics',
            id: array.join(','),
            key: YOUTUBE_API_KEY,
          },
        },
      );
      return videosRes.data;
    } catch (error) {
      console.error('Ошибка запроса к YouTube:', error);
      throw error;
    }
  }

  @Cron('0 * * * *') // каждый час
  async handleCron() {
    try {
      const response = await axios.get('https://www.youtube.com');

      // обработка ответа
      // например, отправка задания в jobs
      //   await this.jobsService.sendEmailJob({
      //     to: 'admin@example.com',
      //     subject: 'YouTube cron request выполнен',
      //   });
    } catch (error) {
      // обработка ошибок
      console.error('Ошибка запроса к YouTube:', error);
    }
  }
}
