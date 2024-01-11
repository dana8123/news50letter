import { Controller, Get } from '@nestjs/common';
import { GptService } from './gpt.service';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Get('/')
  async callApi(): Promise<void> {
    await this.gptService.apiCall();
  }
}
