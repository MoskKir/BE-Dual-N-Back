import { Controller, Get, Post, Query, Body, BadRequestException } from '@nestjs/common';
import { WebsiteAnalysisService } from './website-analysis.service';
import { WebsiteAnalysisDto } from './dto/website-analysis.dto';

@Controller('extract')
export class WebsiteAnalysisController {
  constructor(private readonly extractService: WebsiteAnalysisService) {}

  @Get()
  async getExtract(@Query('imageUrl') imageUrl?: string) {
    if (!imageUrl) {
      throw new BadRequestException('imageUrl is required');
    }
    const result = await this.extractService.extractTextFromImageUrl(imageUrl);
    return { success: true, ...result };
  }

  @Post()
  async postExtract(@Body() dto: WebsiteAnalysisDto) {
    if (!dto?.imageUrl) {
      throw new BadRequestException('imageUrl is required');
    }
    const result = await this.extractService.extractTextFromImageUrl(dto.imageUrl);
    return { success: true, ...result };
  }
}