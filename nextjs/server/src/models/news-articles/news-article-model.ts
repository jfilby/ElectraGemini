import { CustomError } from '@/serene-core-server/types/errors'

export class NewsArticleModel {

  // Consts
  clName = 'NewsArticleModel'

  // Code
  async countForLast24Hours(prisma: any) {

    // Debug
    const fnName = `${this.clName}.exists()`

    // Query
    try {
      return await prisma.newsArticle.count({
        where: {
          created: {
            gte: new Date(new Date().getTime() - (24 * 60 * 60 * 1000))
          }
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }
  }

  async create(
          prisma: any,
          newsSourceId: string,
          entryType: string,
          country2LetterCode: string | undefined,
          author: string,
          title: string,
          url: string,
          urlImage: string | undefined,
          description: string | undefined,
          content: string | undefined,
          published: Date,
          refreshEmbedding: boolean) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.newsArticle.create({
        data: {
          // newsSourceId: newsSourceId,
          entryType: entryType,
          country2LetterCode: country2LetterCode,
          author: author,
          title: title,
          url: url,
          urlImage: urlImage,
          description: description,
          content: content,
          published: published,
          refreshEmbedding: refreshEmbedding,
          newsSource: {
            connect: {
              id: newsSourceId
            }
          }
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async deleteById(
          prisma: any,
          id: string) {

    // Debug
    const fnName = `${this.clName}.deleteById()`

    // Delete
    try {
      return await prisma.newsArticle.delete({
        where: {
          id: id
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }
  }

  async exists(prisma: any,
               entryType: string,
               url: string) {

    // Debug
    const fnName = `${this.clName}.exists()`

    // Query
    var newsArticle: any = null

    try {
      newsArticle = await prisma.newsArticle.findFirst({
        where: {
          entryType: entryType,
          url: url
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    if (newsArticle != null) {
      return true
    } else {
      return false
    }
  }

  async getByInstanceIdAndBatchProcessed(
          prisma: any,
          instanceId: string,
          batchProcessed: boolean,
          limitBy: number | undefined) {

    // Debug
    const fnName = `${this.clName}.getByInstanceIdAndBatchProcessed()`

    // Query
    try {
      return await prisma.newsArticle.findMany({
        where: {
          ofNewsArticleInstances: {
            some: {
              instanceId: instanceId,
              batchProcessed: batchProcessed
            }
          }
        },
        take: limitBy
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async getById(
          prisma: any,
          id: string) {

    // Debug
    const fnName = `${this.clName}.getById()`

    // Query
    var newsArticle: any = null

    try {
      newsArticle = await prisma.newsArticle.findUnique({
        where: {
          id: id
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return newsArticle
  }

  async getByIds(
          prisma: any,
          ids: string[]) {

    // Debug
    const fnName = `${this.clName}.getByIds()`

    // Query
    try {
      return await prisma.newsArticle.findMany({
        where: {
          id: {
            in: ids
          }
        }
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async getByRefreshEmbeddingsNeeded(prisma: any) {

    // Debug
    const fnName = `${this.clName}.getByRefreshEmbeddingsNeeded()`

    // Query
    try {
      return await prisma.newsArticle.findMany({
        where: {
          refreshEmbedding: true
        }
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async getWithoutNewsArticleInstance(
          prisma: any,
          instanceId: string) {

    // Debug
    const fnName = `${this.clName}.getWithoutNewsArticleInstance()`

    // Query
    try {
      return await prisma.newsArticle.findMany({
        where: {
          ofNewsArticleInstances: {
            none: {
              instanceId: instanceId
            }
          }
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }
  }

  async searchIssueEmbeddings(
          prisma: any,
          issueId: string,
          inputVector: any,
          page: number = 0,
          pageSize: number = 10) {

    // Debug
    const fnName = `${this.clName}.searchIssueEmbeddings()`

    // console.log(`${fnName}: input: ${input}`)

    if (inputVector == null) {
      throw new CustomError(`${fnName}: inputVector == null`)
    }

    // Calc offset
    const offset = page * pageSize

    // LimitBy is +1 to determine if more records are available
    const limitBy = pageSize + 1

    // Cosine distance threshold:
    // Increase this value to include more documents, but of less relevance.
    const threshold = 0.6

    // Query
    // The order by includes more than the cosine distance to make the ordering
    // unique (required for accurate paging without duplicating records).
    var newsArticles = await
      prisma.$queryRaw`
        SELECT nws.id, nws.url, nws.title, nws.description, nws.content, nws.embedding <=> ${inputVector}::vector as "_distance"
          FROM news_article nws,
               news_article_issue nwi
         WHERE nws.id       = nwi.news_article_id
           AND nwi.issue_id = ${issueId}
           AND nws.embedding IS NOT NULL
           AND nws.embedding <=> ${inputVector}::vector <= ${threshold}
         ORDER BY "_distance", nws.title, nws.id ASC
         OFFSET ${offset}
         LIMIT ${limitBy};`

    /* Debug
    console.log(`${fnName}: page: ${page} pageSize: ${pageSize} limitBy: ` +
                `${limitBy} newsArticles.length: ${newsArticles.length}`)

    for (const newsArticle of newsArticles) {

      console.log(`- ${newsArticle.title}: ${newsArticle._distance}`)
    } */

    // hasMore
    var hasMore = false

    if (page != null &&
        pageSize != null &&
        newsArticles.length > pageSize) {

      hasMore = true
      newsArticles = newsArticles.slice(0, pageSize)
    }

    // Return
    return {
      newsArticles: newsArticles,
      hasMore: hasMore
    }
  }

  async setEmbedding(
          prisma: any,
          id: string,
          embedding: any) {

    // Debug
    const fnName = `${this.clName}.setEmbedding()`

    // Handle blank embeddings as null (to leave out of search results)
    if (embedding.length === 0) {
      embedding = null
    }

    // Update embedding
    const results = await
      prisma.$executeRaw`UPDATE news_article SET embedding = ${embedding}, refresh_embedding = false WHERE id = ${id};`

    // console.log(`${fnName}: results: ` + JSON.stringify(results))

    if (results === 0) {
      console.warn(`${fnName}: no rows updated`)
    } else if (results > 1) {
      console.warn(`${fnName}: multiple records (${results} updated for id: ` +
                   `${id}`)
    }
  }

  async update(
          prisma: any,
          id: string,
          newsSourceId: string | undefined,
          entryType: string | undefined,
          country2LetterCode: string | undefined,
          author: string | undefined,
          title: string | undefined,
          url: string | undefined,
          urlImage: string | undefined,
          description: string | undefined,
          content: string | undefined,
          published: Date | undefined,
          refreshEmbedding: boolean | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.newsArticle.update({
        data: {
          newsSourceId: newsSourceId,
          entryType: entryType,
          country2LetterCode: country2LetterCode,
          author: author,
          title: title,
          url: url,
          urlImage: urlImage,
          description: description,
          content: content,
          published: published,
          refreshEmbedding: refreshEmbedding
        },
        where: {
          id: id
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async upsert(prisma: any,
               id: string | undefined,
               newsSourceId: string | undefined,
               entryType: string | undefined,
               country2LetterCode: string | undefined,
               author: string | undefined,
               title: string | undefined,
               url: string | undefined,
               urlImage: string | undefined,
               description: string | undefined,
               content: string | undefined,
               published: Date | undefined,
               refreshEmbedding: boolean | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (newsSourceId == null) {
        console.error(`${fnName}: id is null and newsSourceId is null`)
        throw 'Prisma error'
      }

      if (entryType == null) {
        console.error(`${fnName}: id is null and entryType is null`)
        throw 'Prisma error'
      }

      if (author == null) {
        console.error(`${fnName}: id is null and author is null`)
        throw 'Prisma error'
      }

      if (title == null) {
        console.error(`${fnName}: id is null and title is null`)
        throw 'Prisma error'
      }

      if (url == null) {
        console.error(`${fnName}: id is null and url is null`)
        throw 'Prisma error'
      }

      if (published == null) {
        console.error(`${fnName}: id is null and published is null`)
        throw 'Prisma error'
      }

      if (refreshEmbedding == null) {
        console.error(`${fnName}: id is null and refreshEmbedding is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 newsSourceId,
                 entryType,
                 country2LetterCode,
                 author,
                 title,
                 url,
                 urlImage,
                 description,
                 content,
                 published,
                 refreshEmbedding)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 newsSourceId,
                 entryType,
                 country2LetterCode,
                 author,
                 title,
                 url,
                 urlImage,
                 description,
                 content,
                 published,
                 refreshEmbedding)
    }
  }
}
