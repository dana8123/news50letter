import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class GptService {
  constructor(private configService: ConfigService) {}

  async apiCall(newsData) {
    console.log(newsData[0].data);
    const openai = new OpenAI({
      apiKey: this.configService.get<string>('apiKey.chatGpt'),
    });

    const gptData = await Promise.all(
      newsData.map(async (news) => {
        const content = news.data;
        const url = news.url;
        const title = news.title;
        if (!content) {
          throw new Error('기사 내용이 없습니다.');
        }
        const chatCompletion = await openai.chat.completions.create({
          messages: [
            {
              role: 'user',
              content: `이 기사를 50자 내외로 요약해줘. \n${content}`,
            },
          ],
          model: 'gpt-3.5-turbo',
        });

        return {
          content: chatCompletion.choices[0].message.content,
          url,
          title,
        };
      }),
    );

    console.log('실행완료');
    console.log(gptData);

    return gptData;
  }
}
