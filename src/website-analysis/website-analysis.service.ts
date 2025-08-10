import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as fsp from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import axios from 'axios';
import Tesseract from 'tesseract.js';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class WebsiteAnalysisService {
  private readonly logger = new Logger(WebsiteAnalysisService.name);
  private readonly openai: OpenAI;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      this.logger.warn('OPENAI_API_KEY is not set. GPT step will fail without it.');
    }
    this.openai = new OpenAI({ apiKey });
  }

  async extractTextFromImageUrl(imageUrl: string) {
    const tmpDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'extract-'));
    const tempImagePath = path.join(tmpDir, 'temp_image.jpg');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputTextPath = path.join(tmpDir, `extracted_text_${timestamp}.txt`);

    try {
      // 1) Download image
      const response = await axios.get(imageUrl, { responseType: 'stream' });
      await new Promise<void>((resolve, reject) => {
        const writer = fs.createWriteStream(tempImagePath);
        response.data.pipe(writer);
        writer.on('finish', () => resolve());
        writer.on('error', (err) => reject(err));
      });

      // 2) OCR with Tesseract (eng + rus)
      const result = await Tesseract.recognize(tempImagePath, 'eng+rus', {
        logger: (m) => {
          if (m?.status && typeof m.progress === 'number') {
            this.logger.debug(`${m.status}: ${Math.round(m.progress * 100)}%`);
          }
        },
      });
      const extractedText = result.data.text || '';
      this.logger.log(`extractedText length: ${extractedText.length}`);

      // 3) Process with GPT (two passes, like your sample)
      let finalText = extractedText;
      if (this.config.get<string>('OPENAI_API_KEY')) {
        const first = await this.openai.responses.create({
          model: 'gpt-5',
          input: `Здесь представлен результат автоматического сканирования изображения с новостного сайта.\n` +
            `Попытайся структурировать данный набор слов и символов.\n` +
            `Структурируй данный текст и выдели из него основную информацию.\n` +
            `Структурированный и кратко изложенный текст из оригинального хаотичного фрагмента ` +
            `будет представлять собой подборку статей и тем:\n\n` +
            extractedText.slice(6000),
        });

        const firstOut = (first as any).output_text ?? '';

        const second = await this.openai.responses.create({
          model: 'gpt-5',
          input: `${firstOut}\n\n` +
            `Сделай разбор по конкретным темам (политика, экономика, международные темы и т. д.).\n` +
            `Дополнительно предоставь переводы для заголовков статей.\n` +
            `Дай 10 положительных и 10 негативных выводов и для каждого пункта предоставь "сигнальную систему" из ещё 5 пунктов — на что обратить внимание ` +
            `при отслеживании прогресса по конкретному пункту.\n` +
            `Сделай 10 предположений, что может произойти, и 10 — что не произойдёт.`,
        });

        const secondOut = (second as any).output_text ?? '';
        finalText = `${firstOut}\n\n${secondOut}`.trim();
      }

      // 4) Save file
      await fsp.writeFile(outputTextPath, finalText, 'utf8');

      // 5) Cleanup temp image (keep folder for output)
      await fsp.rm(tempImagePath, { force: true });

      return { finalText, filePath: outputTextPath };
    } catch (error: any) {
      this.logger.error(`Error: ${error?.message || error}`);
      throw error;
    }
  }
}
