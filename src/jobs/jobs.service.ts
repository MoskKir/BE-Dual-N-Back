// jobs.service.ts
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class JobsService {
  constructor(@InjectQueue('email') private emailQueue: Queue) {}

  async sendEmailJob(data: { to: string; subject: string }) {
    await this.emailQueue.add('send-email', data, {
      delay: 5000,
      attempts: 3,
    });
  }
}
