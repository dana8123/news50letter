export default () => {
  if (process.env.STAGE === 'local') {
    return {
      port: parseInt(process.env.PORT, 10) || 3000,
      apiKey: {
        chatGpt: process.env.CHAT_GPT_API_KEY,
        news: process.env.NEWS_API_KEY,
      },
    };
  }

  return {};
};
