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
  date: string; // YYYY-MM-DD

  publication?: string | null;
  headlines?: string[] | null;

  negative_conclusions?: unknown[] | null;
  positive_conclusions?: unknown[] | null;

  will_happen?: string[] | null;
  will_not_happen?: string[] | null;

  analysis_ru?: Record<string, any> | null;
  raw_response?: Record<string, any> | null;
}
