export class NewsSourceModel {

  // Consts
  clName = 'NewsSourceModel'

  // Code
  async create(
          prisma: any,
          name: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.newsSource.create({
        data: {
          name: name
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
      return await prisma.newsSource.delete({
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

  async getById(
          prisma: any,
          id: string) {

    // Debug
    const fnName = `${this.clName}.getById()`

    // Query
    var newsSource: any = null

    try {
      newsSource = await prisma.newsSource.findUnique({
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
    return newsSource
  }

  async getByName(
          prisma: any,
          name: string) {

    // Debug
    const fnName = `${this.clName}.getByName()`

    // Query
    var newsSource: any = null

    try {
      newsSource = await prisma.newsSource.findUnique({
        where: {
          name: name
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return newsSource
  }

  async update(
          prisma: any,
          id: string,
          name: string) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.newsSource.update({
        data: {
          name: name
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
               name: string) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (name == null) {
        console.error(`${fnName}: id is null and name is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 name)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 name)
    }
  }
}
