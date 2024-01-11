import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GptController } from './gpt/gpt.controller';
import { GptModule } from './gpt/gpt.module';

@Module({
  imports: [GptModule],
  controllers: [AppController, GptController],
  providers: [AppService],
})
export class AppModule {}
