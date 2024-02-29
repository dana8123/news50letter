import { Controller, Get, Post } from '@nestjs/common';
import { GptService } from './gpt.service';
import { NewsService } from 'src/news/news.service';

@Controller('gpt')
export class GptController {
  constructor(
    private readonly gptService: GptService,
    private newsService: NewsService,
  ) {}

  @Post('/')
  async callApi() {
    return await this.gptService.gptApiCall();
  }

  @Get('/')
  async findNews() {
    const newsData = await this.gptService.findGptContents();

    return newsData;
  }
}
