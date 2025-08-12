import { Controller, Get, Post, Query, Body, BadRequestException } from '@nestjs/common';
import { WebsiteAnalysisService } from './website-analysis.service';
import { WebsiteAnalysisDto } from './dto/website-analysis.dto';

@Controller('website-analysis')
export class WebsiteAnalysisController {
  constructor(private readonly extractService: WebsiteAnalysisService) {}

  @Get()
  async getExtract(
    @Query('imageUrl') imageUrl?: string,
    @Query('websiteAlias') websiteAlias?: string,
    @Query('date') date?: string,
  ) {
    if (!imageUrl) {
      throw new BadRequestException('imageUrl is required');
    }

    const result = await this.extractService.extractTextFromImageUrl(imageUrl, websiteAlias, date);
    return { success: true, ...result };
  }

  @Get('find')
  async findByQuery(
    @Query('imageUrl') imageUrl?: string,
    @Query('websiteAlias') websiteAlias?: string,
    @Query('date') date?: string,
  ) {
    if (!imageUrl && !websiteAlias && !date) {
      throw new BadRequestException('At least one search parameter is required');
    }

    const result = await this.extractService.findBy({
      website_alias: websiteAlias,
      date,
    });

    return {
      success: true,
      count: result.length,
      data: result,
    };
  }
}