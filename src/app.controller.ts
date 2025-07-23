import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { JobsService } from './jobs/jobs.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly jobsService: JobsService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('email')
  async triggerEmail() {
    await this.jobsService.sendEmailJob({
      to: 'user@example.com',
      subject: 'Hello from Bull!',
    });
    return 'Email job added to queue';
  }
}
