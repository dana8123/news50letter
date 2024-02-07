import { Controller, Get } from '@nestjs/common';
import { GptService } from './gpt.service';
import { createGptDataDto } from './gpt.dto';
import { NewsService } from 'src/news/news.service';

@Controller('gpt')
export class GptController {
  constructor(
    private readonly gptService: GptService,
    private newsService: NewsService,
  ) {}

  @Get('/')
  async callApi() {
    const newsData = await this.newsService.crawlingFromData();
    return await this.gptService.apiCall(newsData);
  }
}
