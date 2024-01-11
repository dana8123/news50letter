export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
  apiKey: {
    chatGpt: process.env.CHAT_GPT_API_KEY,
    news: process.env.NEWS_API_KEY,
  },
});
