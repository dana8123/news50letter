import { Module } from '@nestjs/common';
import { GptService } from './gpt.service';
import { GptController } from './gpt.controller';
import { ConfigModule } from '@nestjs/config';
import { NewsService } from 'src/news/news.service';

@Module({
  providers: [GptService, NewsService],
  controllers: [GptController],
  imports: [ConfigModule],
})
export class GptModule {}
