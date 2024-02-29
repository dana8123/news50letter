import { Module } from '@nestjs/common';

import { GptModule } from './gpt/gpt.module';

import { NewsModule } from './news/news.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    GptModule,
    NewsModule,
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
  ],
})
export class AppModule {}
