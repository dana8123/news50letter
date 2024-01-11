import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class GptService {
  constructor(private configService: ConfigService) {}

  async apiCall() {
    const openai = new OpenAI({
      apiKey: this.configService.get<string>('apiKey.chatGpt'),
    });

    const content = {
      text: '경남 창원의 한 주유소에서 배관 연결 문제로 인해 휘발유 차량에 경유가 주유돼 차량 17대가 피해를 입었습니다.\n창원시 진해구청에 따르면 지난 9일 저녁 7시쯤부터 두 시간여 동안 진해의 한 주유소에 있는 전체 주유기 17대 가운데 1대 휘발유 주유기에서 경유가 나왔습니다.이로 인해 해당 주유기를 이용한 휘발유 차량 17대에 경유가 잘못 주입된 것으로 확인됐습니다.주유소 측은 2시간여 뒤인 밤 9시쯤 실시간 기름 계측이 잘못되고 있다는 점을 인지하고, 경찰과 함께 CCTV 등을 분석해 경유를 주유하게 된 차량 차주에게 연락했습니다.피해를 입은 차량 17대는 현재 일부 수리를 마친 것으로 전해졌습니다.해당 주유소는 최근 증축공사를 마치고 영업을 재개했는데, 구청은 이 과정에서 휘발유 배관에 경유 배관이 연결되면서 사고가 발생한 것으로 보고 있습니다.주유소 측은 사고에 대한 책임을 지고 피해 차량에 대해 보상할 계획인 것으로 전해졌습니다.',
    };

    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `이 기사를 50자 내외로 요약해줘. \n${content.text}`,
        },
      ],
      model: 'gpt-3.5-turbo',
    });
    console.log('실행완료');
    console.log(chatCompletion.object, chatCompletion.choices[0].message);
    return;
  }
}
