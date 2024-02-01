import { Module } from '@nestjs/common';

import { GptModule } from './gpt/gpt.module';

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
})
export class AppModule {}
