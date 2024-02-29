import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import OpenAI from 'openai';
import { GptContents } from './gpt.entity';
import { Repository } from 'typeorm';
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as https from 'https';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class GptService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(GptContents)
    private gptContentsRepository: Repository<GptContents>,
  ) {}
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async gptApiCallAndSave() {
    const apiKey = this.configService.get<string>('apiKey.chatGpt');
    const openai = new OpenAI({
      apiKey,
    });

    if (!apiKey) {
      throw new BadRequestException('key error!');
    }

    const newsData = await this.crawlingFromNews();

    const gptData = await Promise.all(
      newsData.map(async (news) => {
        const content = news.data;
        const url = news.url;
        const title = news.title;
        const publishedAt = news.publishedAt;
        if (!content) {
          throw new Error('기사 내용이 없습니다.');
        }
        const chatCompletion = await openai.chat.completions.create({
          messages: [
            {
              role: 'user',
              content: `이 기사를 누가,언제,어디서,무엇을,어떻게,왜 섹션으로 나누어서 정리해줘. \n${content}`,
            },
          ],
          model: 'gpt-3.5-turbo',
        });

        return {
          content: chatCompletion.choices[0].message.content,
          url,
          title,
          publishedAt,
        };
      }),
    );

    await this.gptContentsRepository.save(gptData);

    return gptData;
  }

  // TODO: 크롤링과 데이터 구조화 분리
  async crawlingFromNews() {
    const newsData = await this.callNewsApi();
    const agent = new https.Agent({ rejectUnauthorized: false });

    const news_crawling_hash = new Map([
      ['m.health.chosun.com', '#content > article > div > div:nth-child(6)'],
      [
        'chosun.com',
        '#fusion-app > div.article  > div:nth-child(2) > div > section > article > section > p',
      ],
      ['m.yonhapnewstv.co.kr', '#articleBody'],
      ['investchosun.com', 'div > p'],
      ['techrecipe.co.kr', 'div.entry-content'],
      ['imnews.imbc.com', 'div.news_txt'],
      ['sedaily.com', 'div.article_view'],
      ['hani.co.kr', '#renewal2023 > div.article-text > p'],
      ['news.kbs.co.kr', '#cont_newstext'],
      // TODO: utf 8 변환?
      ['betanews.net', '#adiContents'],
      ['koreadaily.com', '#article_body'],
      // TODO: 신아일보 크롤링 정상작동 확인
      ['shinailbo.co.kr', '#article-view-content-div'],
      ['kbench.com', '#contents_area'],
      // const $p = $('#adiContents').has('p');
      ['betanews.net', '#adiContents'],
      ['biz.heraldcorp.com', '#articleText'],
      [
        'bizhankook.com',
        'body > div.wrap > div.bodyWrapper > div.subContens01.view > div.sub01 > section',
      ],
      ['ekn.kr', '#news_body_area_contents'],
      ['todayan.com', '#article-view-content-div'],
      ['k-trendynews.com', '#snsAnchor > div'],
      ['newspim.com', '#news-contents > p'],
      ['news1.kr', '#articles_detail'],
      // 뒤쪽 html 딸려오는 문제
      ['donga.com', '#article_txt'],
      [
        'medicaltimes.com',
        '#container > div > section.viewContWrap > div.viewCont_wrap > div.view_cont.ck-content.clearfix > p',
      ],
      ['etnews.com', '#articleBody > p'],
      [
        'businesspost.co.kr',
        '#center-box > div.container.sub2_detail2 > div.detail_box2 > div > div.detail_editor > div',
      ],
    ]);

    const newList = await Promise.all(
      newsData.articles.map(async (article) => {
        console.log(article.url, article.title);

        try {
          const response = await axios.get(article.url, {
            httpsAgent: agent,
          });

          const $ = cheerio.load((await response).data, {
            decodeEntities: true,
          });

          const trimmedDomain = new URL(article.url).hostname.replace(
            'www.',
            '',
          );

          if (news_crawling_hash.has(trimmedDomain)) {
            const $p = $(news_crawling_hash.get(trimmedDomain));
            const data = $p.text().replace(/\n/g, '').replace(/\t/g, '');
            return {
              data,
              title: article.title,
              publishedAt: article.publishedAt,
              url: article.url,
            };
          }

          if (article.url.includes('youtube')) {
            return;
          }

          if (article.url.includes('yna')) {
            return;
          }
        } catch (e) {
          // AxiosError: Request failed with status code 403
          if (e.code == 'ERR_BAD_REQUEST') {
            console.log('잘못된 URL 입니다.');
          } else if (e.code == 'ECONNRESET') {
            console.log('너무 많은 요청을 보냈습니다.');
          } else {
            console.log(e);
          }
        }
      }),
    );

    const filtered = newList.filter(
      (newsData) => newsData !== undefined && newsData.data !== '',
    );

    return filtered;
  }

  async findGptContents() {
    return this.gptContentsRepository.find();
  }

  private async callNewsApi() {
    try {
      const apiKey = this.configService.get<string>('apiKey.news');

      if (!apiKey) {
        throw new BadRequestException('news api key error');
      }

      const response = await axios.get(
        `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${apiKey}`,
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching data from api`);
      throw error;
    }
  }
}
