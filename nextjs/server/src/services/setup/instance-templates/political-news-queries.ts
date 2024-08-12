import { NewsArticleQueryModel } from '@/models/news-articles/news-article-query-model'

export class PoliticalNewsQueries {

  // Consts
  clName = 'PoliticalNewsQueries'

  // Common queries for politics-related news
  topicQueries = [
    {
      topic: `Climate change`,
      query: `climate change`
    },
    {
      topic: `Climate change`,
      query: `renewable energy`
    },
    {
      topic: `Healthcare`,
      query: `personalized healthcare`
    },
    {
      topic: `Healthcare`,
      query: `economics of medical research`
    },
    {
      topic: `Socioeconomic inequality`,
      query: `socioeconomic inequality`
    }
  ]

  // Models
  newsArticleQueryModel = new NewsArticleQueryModel()

  // Source
  async setup(prisma: any,
              instanceId: string) {

    for (const topicQuery of this.topicQueries) {

      await this.newsArticleQueryModel.upsert(
              prisma,
              undefined,  // id
              instanceId,
              topicQuery.topic,
              topicQuery.query)
    }
  }
}
