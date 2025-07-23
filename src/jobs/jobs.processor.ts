import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('email')
export class JobsProcessor {
  @Process('send-email')
  async handleSendEmail(job: Job<{ to: string; subject: string }>) {
    console.log(`📧 Sending email to ${job.data.to} with subject "${job.data.subject}"`);
    // Здесь можно вызывать почтовый сервис или другую логику
  }
}
