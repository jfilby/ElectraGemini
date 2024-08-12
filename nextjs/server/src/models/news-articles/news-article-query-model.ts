export class NewsArticleQueryModel {

  // Consts
  clName = 'NewsArticleQueryModel'

  // Code
  async create(
          prisma: any,
          instanceId: string,
          topic: string,
          query: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.newsArticleQuery.create({
        data: {
          instanceId: instanceId,
          topic: topic,
          query: query

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
      return await prisma.newsArticleQuery.delete({
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
      return await prisma.newsArticleQuery.deleteMany({
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

  async getById(
          prisma: any,
          id: string) {

    // Debug
    const fnName = `${this.clName}.getById()`

    // Query
    var newsArticle: any = null

    try {
      newsArticle = await prisma.newsArticleQuery.findUnique({
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

  async getByInstanceId(
          prisma: any,
          instanceId: string) {

    // Debug
    const fnName = `${this.clName}.getByInstanceId()`

    // Query
    try {
      return await prisma.newsArticleQuery.findMany({
        where: {
          instanceId: instanceId
        }
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async getByInstanceIds(
          prisma: any,
          instanceIds: string[]) {

    // Debug
    const fnName = `${this.clName}.getByInstanceIds()`

    // Query
    try {
      return await prisma.newsArticleQuery.findMany({
        where: {
          instanceId: {
            in: instanceIds
          }
        }
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async getByUniqueKey(
          prisma: any,
          instanceId: string,
          topic: string,
          query: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Query
    var newsArticle: any = null

    try {
      newsArticle = await prisma.newsArticleQuery.findFirst({
        where: {
          instanceId: instanceId,
          topic: topic,
          query: query
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

  async update(
          prisma: any,
          id: string,
          instanceId: string | undefined,
          topic: string | undefined,
          query: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.newsArticleQuery.update({
        data: {
          instanceId: instanceId,
          topic: topic,
          query: query
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
               topic: string | undefined,
               query: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // If id not specified, but other fields are, try to get an existing record
    if (id == null &&
        instanceId != null &&
        topic != null &&
        query != null) {

      const newsArticleQuery = await
              this.getByUniqueKey(
                prisma,
                instanceId,
                topic,
                query)

      if (newsArticleQuery != null) {
        id = newsArticleQuery.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (instanceId == null) {
        console.error(`${fnName}: id is null and instanceId is null`)
        throw 'Prisma error'
      }

      if (topic == null) {
        console.error(`${fnName}: id is null and topic is null`)
        throw 'Prisma error'
      }

      if (query == null) {
        console.error(`${fnName}: id is null and query is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 instanceId,
                 topic,
                 query)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 instanceId,
                 topic,
                 query)
    }
  }
}
