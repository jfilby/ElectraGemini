export class NewsArticleInstanceModel {

  // Consts
  clName = 'NewsArticleInstanceModel'

  // Code
  async create(
          prisma: any,
          instanceId: string,
          newsArticleId: string,
          batchProcessed: boolean) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.newsArticleInstance.create({
        data: {
          instanceId: instanceId,
          newsArticleId: newsArticleId,
          batchProcessed: batchProcessed
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
      return await prisma.newsArticleInstance.delete({
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

  async deleteByInstanceId(
          prisma: any,
          instanceId: string) {

    // Debug
    const fnName = `${this.clName}.deleteByIssueId()`

    // Delete
    try {
      return await prisma.newsArticleInstance.deleteMany({
        where: {
          instanceId: instanceId
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }
  }

  async getByInstanceIdAndBatchProcessed(
          prisma: any,
          instanceId: string | undefined,
          batchProcessed: boolean | undefined,
          includeNewsArticles: boolean = false,
          limitBy: number | undefined) {

    // Debug
    const fnName = `${this.clName}.getByBatchProcessed()`

    // Query
    try {
      return await prisma.newsArticleInstance.findMany({
        include: {
          newsArticle: includeNewsArticles
        },
        where: {
          instanceId: instanceId,
          batchProcessed: batchProcessed
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
    var newsArticleInstance: any = null

    try {
      newsArticleInstance = await prisma.newsArticleInstance.findUnique({
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
    return newsArticleInstance
  }

  async getByInstanceIdAndNewsArticleId(
          prisma: any,
          instanceId: string,
          newsArticleId: string,
          includeNewsArticle: boolean = false) {

    // Debug
    const fnName = `${this.clName}.getByInstanceIdAndNewsArticleId()`

    // Query
    try {
      return await prisma.newsArticleInstance.findFirst({
        include: {
          newsArticle: includeNewsArticle
        },
        where: {
          instanceId: instanceId,
          newsArticleId: newsArticleId
        }
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async setBatchProcessedByIds(
          prisma: any,
          instanceId: string,
          newsArticleIds: string[],
          batchProcessed: boolean) {

    // Debug
    const fnName = `${this.clName}.setBatchProcessedByIds()`

    // Update record
    try {
      return await prisma.newsArticleInstance.updateMany({
        data: {
          batchProcessed: batchProcessed
        },
        where: {
          instanceId: instanceId,
          newsArticleId: {
            in: newsArticleIds
          }
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async update(
          prisma: any,
          id: string,
          instanceId: string | undefined,
          newsArticleId: string | undefined,
          batchProcessed: boolean | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.newsArticleInstance.update({
        data: {
          instanceId: instanceId,
          newsArticleId: newsArticleId,
          batchProcessed: batchProcessed
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
               instanceId: string | undefined,
               newsArticleId: string | undefined,
               batchProcessed: boolean | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // Get id if instanceId specified
    if (id == null &&
        instanceId != null &&
        newsArticleId != null) {

      const newsArticleInstance = await
              this.getByInstanceIdAndNewsArticleId(
                prisma,
                instanceId,
                newsArticleId)

      if (newsArticleInstance != null) {

        id = newsArticleInstance.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (instanceId == null) {
        console.error(`${fnName}: id is null and instanceId is null`)
        throw 'Prisma error'
      }

      if (newsArticleId == null) {
        console.error(`${fnName}: id is null and newsArticleId is null`)
        throw 'Prisma error'
      }

      if (batchProcessed == null) {
        console.error(`${fnName}: id is null and batchProcessed is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 instanceId,
                 newsArticleId,
                 batchProcessed)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 instanceId,
                 newsArticleId,
                 batchProcessed)
    }
  }
}
