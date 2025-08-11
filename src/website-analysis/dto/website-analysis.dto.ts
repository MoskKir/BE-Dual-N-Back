import { IsString, IsUrl } from 'class-validator';

export class WebsiteAnalysisDto {
  @IsString()
  @IsUrl({ require_tld: false })
  imageUrl!: string;

  @IsString()
  websiteAlias!: string;

  @IsString()
  date!: string;
}

export interface CreateWebsiteAnalysisDto {
  website_alias: string;
  date: string;
  description?: string | null;
  analysis?: string | null;
}
