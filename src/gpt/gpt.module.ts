import { Module } from '@nestjs/common';
import { GptService } from './gpt.service';
import { GptController } from './gpt.controller';
import { ConfigModule } from '@nestjs/config';
import { NewsService } from 'src/news/news.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GptContents } from './gpt.entity';

@Module({
  providers: [GptService, NewsService],
  controllers: [GptController],
  imports: [ConfigModule, TypeOrmModule.forFeature([GptContents])],
})
export class GptModule {}
