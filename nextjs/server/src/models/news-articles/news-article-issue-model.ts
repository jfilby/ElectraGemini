export class NewsArticleIssueModel {

  // Consts
  clName = 'NewsArticleIssueModel'

  // Code
  async create(
          prisma: any,
          instanceId: string,
          issueId: string,
          newsArticleId: string,
          batchProcessed: boolean) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.newsArticleIssue.create({
        data: {
          instanceId: instanceId,
          issueId: issueId,
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
      return await prisma.newsArticleIssue.delete({
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

  async deleteByIssueId(
          prisma: any,
          issueId: string) {

    // Debug
    const fnName = `${this.clName}.deleteById()`

    // Delete
    try {
      return await prisma.newsArticleIssue.deleteMany({
        where: {
          issueId: issueId
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }
  }

  async getByBatchProcessed(
          prisma: any,
          batchProcessed: boolean) {

    // Debug
    const fnName = `${this.clName}.getByBatchProcessed()`

    // Query
    try {
      return await prisma.newsArticleIssue.findMany({
        where: {
          batchProcessed: batchProcessed
        }
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
    var newsArticleIssue: any = null

    try {
      newsArticleIssue = await prisma.newsArticleIssue.findUnique({
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
    return newsArticleIssue
  }

  async getByIssueId(
          prisma: any,
          issueId: string,
          includeNewsArticle: boolean = false) {

    // Debug
    const fnName = `${this.clName}.getByIssueId()`

    // console.log(`${fnName}: issueId: ${issueId}`)

    // Query
    try {
      return await prisma.newsArticleIssue.findMany({
        include: {
          newsArticle: includeNewsArticle
        },
        where: {
          issueId: issueId
        }
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async getByIssueIdAndNewsArticleId(
          prisma: any,
          issueId: string,
          newsArticleId: string,
          includeNewsArticle: boolean = false) {

    // Debug
    const fnName = `${this.clName}.getByIssueId()`

    // Query
    try {
      return await prisma.newsArticleIssue.findFirst({
        include: {
          newsArticle: includeNewsArticle
        },
        where: {
          issueId: issueId,
          newsArticleId: newsArticleId
        }
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async getDistinctIssuesByInstanceIdAndBatchProcessed(
          prisma: any,
          instanceId: string,
          batchProcessed: boolean) {

    // Debug
    const fnName = `${this.clName}.getDistinctIssuesByInstanceIdAndBatchProcessed()`

    // Query
    try {
      return await prisma.newsArticleIssue.findMany({
        distinct: ['issueId'],
        select: {
          issueId: true
        },
        where: {
          instanceId: instanceId,
          batchProcessed: batchProcessed
        }
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async setBatchProcessedByIds(
          prisma: any,
          issueIds: string[],
          newsArticleIds: string[] | undefined,
          batchProcessed: boolean) {

    // Debug
    const fnName = `${this.clName}.setBatchProcessedByIds()`

    // Update record
    try {
      return await prisma.newsArticleIssue.updateMany({
        data: {
          batchProcessed: batchProcessed
        },
        where: {
          issueId: {
            in: issueIds
          },
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
          issueId: string | undefined,
          newsArticleId: string | undefined,
          batchProcessed: boolean | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.newsArticleIssue.update({
        data: {
          instanceId: instanceId,
          issueId: issueId,
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
               issueId: string | undefined,
               newsArticleId: string | undefined,
               batchProcessed: boolean | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // Get id if issueId specified
    if (id == null &&
        issueId != null &&
        newsArticleId != null) {

      const newsArticleIssue = await
              this.getByIssueIdAndNewsArticleId(
                prisma,
                issueId,
                newsArticleId)

      if (newsArticleIssue != null) {

        id = newsArticleIssue.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (instanceId == null) {
        console.error(`${fnName}: id is null and instanceId is null`)
        throw 'Prisma error'
      }

      if (issueId == null) {
        console.error(`${fnName}: id is null and issueId is null`)
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
                 issueId,
                 newsArticleId,
                 batchProcessed)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 instanceId,
                 issueId,
                 newsArticleId,
                 batchProcessed)
    }
  }
}
