import { Module } from '@nestjs/common';

import { GptModule } from './gpt/gpt.module';
import { NewsController } from './news/news.controller';
import { NewsModule } from './news/news.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    GptModule,
    NewsModule,
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
  ],
  controllers: [NewsController],
})
export class AppModule {}
