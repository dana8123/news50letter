import { Controller, Get, Post } from '@nestjs/common';
import { GptService } from './gpt.service';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('/')
  async callApi() {
    return await this.gptService.gptApiCallAndSave();
  }

  @Get('/')
  async findNews() {
    const newsData = await this.gptService.findGptContents();

    return newsData;
  }
}
