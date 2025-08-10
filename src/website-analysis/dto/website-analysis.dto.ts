import { IsString, IsUrl } from 'class-validator';

export class WebsiteAnalysisDto {
  @IsString()
  @IsUrl({ require_tld: false })
  imageUrl!: string;
}