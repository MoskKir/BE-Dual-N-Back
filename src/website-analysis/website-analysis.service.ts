import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as fsp from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import axios from 'axios';
import * as Tesseract from 'tesseract.js';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { WebsiteAnalysis } from '../models/websites-analysis/WebsiteAnalysis';
import { CreateWebsiteAnalysisDto } from './dto/website-analysis.dto';

@Injectable()
export class WebsiteAnalysisService {
  private readonly logger = new Logger(WebsiteAnalysisService.name);
  private readonly openai: OpenAI;

  constructor(
    private readonly config: ConfigService,
    @InjectRepository(WebsiteAnalysis) // Injects the User repository (DB table interface)
    private websiteAnalysisRepository: Repository<WebsiteAnalysis>,
  ) {
    const apiKey = this.config.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      this.logger.warn(
        'OPENAI_API_KEY is not set. GPT step will fail without it.',
      );
    }
    this.openai = new OpenAI({ apiKey });
  }

  async create(dto: CreateWebsiteAnalysisDto): Promise<any> {
    const entity = this.websiteAnalysisRepository.create(dto as any);
    return this.websiteAnalysisRepository.save(entity);
  }

  async findBy(dto) {
    return this.websiteAnalysisRepository.findBy(dto);
  }

  async extractTextFromImageUrl(
    imageUrl: string,
    websiteAlias: string,
    date: string,
  ) {
    const tmpDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'extract-'));
    const tempImagePath = path.join(tmpDir, 'temp_image.jpg');

    try {
      const existingResult = await this.findBy({
        website_alias: websiteAlias,
        date,
      });

      if (existingResult.length) {
        // return existingResult;
        const result = existingResult[0];
        return { data: [{ ...result }] };
      }

      // 1) Download image
      const response = await axios.get(imageUrl, { responseType: 'stream' });
      await new Promise<void>((resolve, reject) => {
        const writer = fs.createWriteStream(tempImagePath);
        response.data.pipe(writer);
        writer.on('finish', () => resolve());
        writer.on('error', (err) => reject(err));
      });

      // 2) OCR with Tesseract (eng + rus)
      const ocrResult = await Tesseract.recognize(tempImagePath, 'eng+rus', {
        logger: (m) => {
          if (m?.status && typeof m.progress === 'number') {
            this.logger.debug(`${m.status}: ${Math.round(m.progress * 100)}%`);
          }
        },
      });
      const extractedText = ocrResult.data.text || '';
      this.logger.log(`extractedText length: ${extractedText.length}`);

      const prompt = `
        You are an information extractor.

        Task:
        - From the INPUT TEXT, extract:
          1) publication (the news outlet / magazine name),
          2) headlines (main article titles) in order of appearance.

        Rules:
        - Headlines are short meaning-carrying phrases (usually Title Case).
        - Ignore menus, buttons, promos, dates, “subscribe/log in”, “current issue”, prices, event ads, podcast promos, author names, bylines, and photo captions.
        - Do NOT include subheadings or taglines; only the main titles.
        - Clean OCR noise: join broken lines, fix hyphenated line breaks, drop stray symbols.
        - If unsure whether a line is a real headline, exclude it.
        - If the publication cannot be found, return publication = "".
        - Output MUST match the provided JSON schema exactly. No extra fields, no commentary.

        INPUT TEXT:
        <<<
        ${extractedText.slice(0, 6000)}
        >>>

        IGNORE any line that matches these patterns (case-insensitive):
        - subscribe|log in|current issue|archive|table of contents|menu
        - newsletters|podcast|books|affairs|spotlight
        - most read|editor's pick|view all|follow the podcast
      `;

      const firstStep = await this.openai.responses.create({
        model: 'gpt-4',
        input: prompt,
      });
      this.logger.log(`finalText length: ${firstStep.output_text || 0}`);

      const firstStepJson = JSON.parse(firstStep.output_text);

      const secondStepPrompt = `
        You are an classifier, and analyst.

        TASKS:
        1) From the INPUT TEXT, extract:
          - publication: the news outlet / magazine name
          - headlines: main article titles ONLY (no taglines/subtitles)

        2) Classify each headline into ONE topic bucket:
          - Politics
          - Economy
          - International
          - Security_Defense
          - Technology_Science
          - Society_Culture
          - Environment_Climate
          - Business_Markets
          - Law_Justice
          - Opinion_Editorial
          - Other

        3) Provide a Russian translation for each headline (title_ru).

        4) Analytical block:
          - Create 10 positive conclusions (positive_conclusions) based ONLY on the extracted headlines.
          - Create 10 negative conclusions (negative_conclusions) based ONLY on the extracted headlines.
          - For each conclusion, provide a "signal system" — exactly 5 concise monitoring points that indicate progress or change related to that conclusion.
          - Create 10 predictions about what IS LIKELY to happen (will_happen) and 10 predictions about what is UNLIKELY to happen (will_not_happen), using ONLY the extracted headlines as source material.

        RULES:
        - Headlines: short, meaning-carrying phrases (Title Case or clear sentence case).
        - Ignore: menus, buttons, promos, prices, dates, “subscribe/log in”, “current issue”, “table of contents”, “view all”, “most read”, “editor's pick”, event ads, podcast promos, newsletter prompts, author names/bylines, photo captions.
        - Do NOT include subheadings/taglines; only the main title.
        - Clean OCR noise: join broken/wrapped lines; fix hyphenated line breaks; remove stray symbols and emojis; normalize whitespace; trim punctuation.
        - Deduplicate similar/identical headlines.
        - If unsure about a headline, exclude it.
        - Use only INPUT TEXT for all conclusions and predictions — no outside knowledge.

        OUTPUT:
        MUST match this JSON schema exactly:

        {
          "publication": "string",
          "topics": {
            "Politics": [{"title": "string", "title_ru": "string"}],
            "Economy": [{"title": "string", "title_ru": "string"}],
            "International": [{"title": "string", "title_ru": "string"}],
            "Security_Defense": [{"title": "string", "title_ru": "string"}],
            "Technology_Science": [{"title": "string", "title_ru": "string"}],
            "Society_Culture": [{"title": "string", "title_ru": "string"}],
            "Environment_Climate": [{"title": "string", "title_ru": "string"}],
            "Business_Markets": [{"title": "string", "title_ru": "string"}],
            "Law_Justice": [{"title": "string", "title_ru": "string"}],
            "Opinion_Editorial": [{"title": "string", "title_ru": "string"}],
            "Other": [{"title": "string", "title_ru": "string"}]
          },
          "analysis": {
            "positive_conclusions": [
              {"conclusion": "string", "signals": ["string", "string", "string", "string", "string"]},
            ],
            "negative_conclusions": [
              {"conclusion": "string", "signals": ["string", "string", "string", "string", "string"]}
            ],
            "will_happen": ["string"],
            "will_not_happen": ["string"]
          }
          "analysis_ru": {
            "positive_conclusions": [
              {"conclusion": "string", "signals": ["string", "string", "string", "string", "string"]},
            ],
            "negative_conclusions": [
              {"conclusion": "string", "signals": ["string", "string", "string", "string", "string"]}
            ],
            "will_happen": ["string"],
            "will_not_happen": ["string"]
          }
        }

        INPUT TEXT:
        <<<
        ${firstStepJson.headlines.join('\n')}
        >>>

        IGNORE any line matching these (case-insensitive):
        subscribe|log[ -]?in|current issue|archive|table of contents|menu|newsletters?|books?|podcast|spotlight|most read|editor'?s pick|view all|follow (the )?podcast|full table of contents|listen to (the )?episode|book reviews?|subscribe( now)?|download (the )?app|backstory|about|contact|permissions|submissions|leave us feedback|graduate school forum|event|summit|conference|tickets?|pricing|CEO summit|advertisement|ad|
        ^\s*(by|author|review by)\b|^\s*\$?\d+(\.\d{2})?\s*$

        LANGUAGE:
        - Translate titles to Russian in "title_ru".
        - Translate analysis to Russian in "analysis_ru".
      `;

      const secondStep = await this.openai.responses.create({
        model: 'gpt-4',
        input: secondStepPrompt,
      });

      const secondStepOutput = secondStep.output_text || '';
      const result = JSON.parse(secondStepOutput);

      await fsp.rm(tempImagePath, { force: true });

      await this.create({
        website_alias: websiteAlias,
        date: date,
        publication: firstStepJson.publication || '',
        headlines: firstStepJson.headlines || [],
        negative_conclusions: result.analysis?.negative_conclusions || [],
        positive_conclusions: result.analysis?.positive_conclusions || [],
        will_happen: result.analysis?.will_happen || [],
        will_not_happen: result.analysis?.will_not_happen || [],
        analysis_ru: result.analysis_ru || {},
        raw_response: { ...firstStepJson, result },
      });

      return { result: { ...firstStepJson, result } };
    } catch (error: any) {
      this.logger.error(`Error: ${error?.message || error}`);
      throw error;
    }
  }
}
