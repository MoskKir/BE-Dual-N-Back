import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WebsiteAnalysisController } from './website-analysis.controller';
import { WebsiteAnalysisService } from './website-analysis.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [WebsiteAnalysisController],
  providers: [WebsiteAnalysisService],
})
export class WebsiteAnalysisModule {}