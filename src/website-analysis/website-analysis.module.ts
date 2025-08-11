import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsiteAnalysisController } from './website-analysis.controller';
import { WebsiteAnalysisService } from './website-analysis.service';
import { WebsiteAnalysis } from '../models/websites-analysis/WebsiteAnalysis';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([WebsiteAnalysis])
  ],
  controllers: [WebsiteAnalysisController],
  providers: [WebsiteAnalysisService],
})
export class WebsiteAnalysisModule {}