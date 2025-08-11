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
    console.log(imageUrl);
    console.log(websiteAlias);
    console.log(date);
    // return { success: true, result: 'nice' };
    const result = await this.extractService.extractTextFromImageUrl(imageUrl, websiteAlias, date);
    return { success: true, ...result };
  }

  // @Post()
  // async postExtract(@Body() dto: WebsiteAnalysisDto) {
  //   if (!dto?.imageUrl) {
  //     throw new BadRequestException('imageUrl is required');
  //   }
  //   const result = await this.extractService.extractTextFromImageUrl(dto.imageUrl);
  //   return { success: true, ...result };
  // }
}