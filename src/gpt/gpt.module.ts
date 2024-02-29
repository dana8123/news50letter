import { Module } from '@nestjs/common';
import { GptService } from './gpt.service';
import { GptController } from './gpt.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GptContents } from './gpt.entity';

@Module({
  providers: [GptService],
  controllers: [GptController],
  imports: [ConfigModule, TypeOrmModule.forFeature([GptContents])],
})
export class GptModule {}
