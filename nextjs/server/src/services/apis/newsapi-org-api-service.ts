import { BaseDataTypes } from '@/types/base-data-types'
import { CustomError } from '@/serene-core-server/types/errors'
import { InstanceModel } from '@/models/instances/instance-model'
import { NewsArticleInstanceModel } from '@/models/news-articles/news-article-instance-model'
import { NewsArticleModel } from '@/models/news-articles/news-article-model'
import { NewsArticleQueryModel } from '@/models/news-articles/news-article-query-model'
import { NewsSourceModel } from '@/models/news-articles/news-source-model'
import { InstanceService } from '../instances/service'

export class NewsApiOrgService {

  // Consts
  clName = 'NewsApiOrgService'

  newsApiOrgDailyQuota = 100
  pageSize = 1  // Class default, mainly used for testing

  // Models
  instanceModel = new InstanceModel()
  newsArticleInstanceModel = new NewsArticleInstanceModel()
  newsArticleModel = new NewsArticleModel()
  newsArticleQueryModel = new NewsArticleQueryModel()
  newsSourceModel = new NewsSourceModel()

  // Services
  instanceService = new InstanceService()

  // Code
  async getQuotaIsExhausted(prisma: any) {

    // Debug
    const fnName = `${this.clName}.getQuotaIsExhausted()`

    // Get the count for the last 24 hours
    const count = await
            this.newsArticleModel.countForLast24Hours(prisma)

    // Verify
    if (count >= this.newsApiOrgDailyQuota) {
      return true
    } else {
      return false
    }
  }

  async queryEverything(queryString: string) {

    // Debug
    const fnName = `${this.clName}.queryEverything()`

    // URL to fetch
    const url = `https://newsapi.org/v2/everything?q=${queryString}&` +
                `pageSize=${this.pageSize}&` +
                `apiKey=` + process.env.NEXT_PUBLIC_NEWSAPI_ORG_API_KEY

    // Try to fetch
    try {
      const response = await fetch(url)

      if (!response.ok) {
        return {
          status: false,
          message: `Failed to query newsapi.org: status: ${response.status} ` +
                   `with text: ${response.statusText}`
        }
      }

      return await response.json()
    } catch(error) {

      console.error(`${fnName}: error: ${error}`)
      throw new CustomError(`${fnName}: error: ${error}`)
    }
  }

  async queryTopHeadlines(
          countryCode2Letter: string,
          category: string | undefined,
          pageSize: number | undefined) {

    // Debug
    const fnName = `${this.clName}.queryTopHeadlines()`

    // Page size
    if (pageSize == null) {
      pageSize = this.pageSize
    }

    // URL to fetch
    var url = `https://newsapi.org/v2/top-headlines?` +
              `country=${countryCode2Letter}&`

    if (category != null) {

      url += `category=${category}&`
    }

    url += `pageSize=${pageSize}&` +
           `apiKey=` + process.env.NEXT_PUBLIC_NEWSAPI_ORG_API_KEY

    // Try to fetch
    try {
      const response = await fetch(url)

      if (!response.ok) {
        return {
          status: false,
          message: `Failed to query newsapi.org: status: ${response.status} ` +
                   `with text: ${response.statusText}`
        }
      }

      return await response.json()
    } catch(error) {

      console.error(`${fnName}: error: ${error}`)
      throw new CustomError(`${fnName}: error: ${error}`)
    }
  }

  async importByCountryTopHeadlines(prisma: any) {

    // Debug
    const fnName = `${this.clName}.importByCountryTopHeadlines()`

    // Don't proceed if the quota has been fully utilized
    if (await this.getQuotaIsExhausted(prisma) === true) {

      return
    }

    // Get country codes for active instances
    const country2LetterCodes = await
            this.instanceService.getCountry2LetterCodesByInstanceStatus(
              prisma,
              BaseDataTypes.activeStatus)

    // Categories
    const categories = [
      'business',
      'general',
      'health',
      'technology'
    ]

    // Calculate the page size to evenly distribute the available quota
    const pageSize =
            this.newsApiOrgDailyQuota / country2LetterCodes.length / categories.length

    // Query and save results
    for (const country2LetterCode of country2LetterCodes) {

      for (const category of categories) {

        // Get active instances for the country code
        const instances = await
                this.instanceModel.getByInstanceTypesAndStatusAndCountryCode(
                  prisma,
                  undefined,  // instanceTypes
                  BaseDataTypes.activeStatus,
                  country2LetterCode)

        // Get instanceIds
        var instanceIds: string[] = []

        for (const instance of instances) {
    
          instanceIds.push(instance.id)
        }
    
        // Query the API
        const results = await
                this.queryTopHeadlines(
                  country2LetterCode,
                  category,
                  pageSize)

        // Debug
        console.log(`${fnName}: found ${results.articles.length} results ` +
                    `for country code: ${country2LetterCode} and ` +
                    `category: ${category}`)

        // Save results
        for (const article of results.articles) {

          await this.saveArticle(
                  prisma,
                  article,
                  instanceIds,
                  country2LetterCode)
        }
      }
    }
  }

  async importByQuery(prisma: any) {

    // Don't proceed if the quota has been fully utilized
    if (await this.getQuotaIsExhausted(prisma) === true) {

      return
    }

    // Get the list of active instances
    const instances = await
            this.instanceModel.filter(
              prisma,
              undefined,  // parentId
              undefined,  // orgType
              undefined,  // instanceType
              BaseDataTypes.activeStatus,
              undefined,  // publicAccess
              false,      // includeCreatedByUserProfile
              false)      // includeCreatedByUser

    var instanceIds: string[] = []

    for (const instance of instances) {

      instanceIds.push(instance.id)
    }

    // Get queries
    const newsArticleQueries = await
            this.newsArticleQueryModel.getByInstanceIds(
              prisma,
              instanceIds)

    // Query and save results
    for (const newsArticleQuery of newsArticleQueries) {

      // Query the API
      const results = await
              this.queryEverything(newsArticleQuery.query)

      // Save results
      for (const article of results.articles) {

        await this.saveArticle(
                prisma,
                article,
                instanceIds,
                undefined)  // country2LetterCode
      }
    }
  }

  async saveArticle(
          prisma: any,
          article: any,
          instanceIds: string[],
          country2LetterCode: string | undefined) {

    // Skip removed articles
    if (article.author == null ||
        article.title == null) {
      return
    }

    if (article.title.toLowerCase() === '[removed]') {
      return
    }

    // Does the article already exist?
    const exists = await
            this.newsArticleModel.exists(
              prisma,
              BaseDataTypes.leadNewsArticleEntryType,
              article.url)

    if (exists === true) {
      return
    }

    // Get/create NewsSource
    var newsSource = await
          this.newsSourceModel.getByName(
            prisma,
            article.source.name)

    if (newsSource == null) {

      newsSource = await
        this.newsSourceModel.create(
          prisma,
          article.source.name)
    }

    // Parse
    const published = new Date(article.publishedAt)

    // Save
    const newsArticle = await
            this.newsArticleModel.create(
              prisma,
              newsSource.id,
              BaseDataTypes.leadNewsArticleEntryType,
              country2LetterCode,
              article.author,
              article.title,
              article.url,
              article.urlToImage,
              article.description,
              article.content,
              published,
              true)  // refreshEmbedding

    for (const instanceId of instanceIds) {

      var newsArticleInstance = await
            this.newsArticleInstanceModel.getByInstanceIdAndNewsArticleId(
              prisma,
              instanceId,
              newsArticle.id)

      if (newsArticleInstance == null) {

        newsArticleInstance = await
          this.newsArticleInstanceModel.create(
            prisma,
            instanceId,
            newsArticle.id,
            false)  // batchProcessed
      }
    }
  }
}
