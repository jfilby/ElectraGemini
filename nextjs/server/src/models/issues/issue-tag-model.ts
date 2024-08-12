export class IssueTagModel {

  // Consts
  clName = 'IssueTagModel'

  // Code
  async create(
          prisma: any,
          issueId: string,
          issueTagOptionId: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.issueTag.create({
        data: {
          issueId: issueId,
          issueTagOptionId: issueTagOptionId
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
      return await prisma.issueTag.delete({
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
    const fnName = `${this.clName}.deleteByIssueId()`

    // Delete
    try {
      return await prisma.issueTag.deleteMany({
        where: {
          issueId: issueId
        }
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async deleteByIssueTagOptionId(
          prisma: any,
          issueTagOptionId: string) {

    // Debug
    const fnName = `${this.clName}.deleteByIssueTagOptionId()`

    // Delete
    try {
      return await prisma.issueTag.deleteMany({
        where: {
          issueTagOptionId: issueTagOptionId
        }
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async filter(
          prisma: any,
          issueId: string | undefined,
          issueTagOptionId: string | undefined,
          orderByName: boolean = false) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.issueTag.findMany({
        where: {
          issueId: issueId,
          issueTagOptionId: issueTagOptionId
        },
        orderBy: orderByName ? {
          issueTagOption: {
            name: 'asc'
          }
        } : undefined
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async getById(
          prisma: any,
          id: string,
          includeIssueTagOption: boolean = false) {

    // Debug
    const fnName = `${this.clName}.getById()`

    // Query
    var issueTag: any = null

    try {
      issueTag = await prisma.issueTag.findUnique({
        include: {
          issueTagOption: includeIssueTagOption
        },
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
    return issueTag
  }

  async getByIssueIdAndIssueTagOptionId(
          prisma: any,
          issueId: string,
          issueTagOptionId: string) {

    // Debug
    const fnName = `${this.clName}.getByIssueIdAndIssueTagOptionId()`

    // Query
    var issueTag: any = null

    try {
      issueTag = await prisma.issueTag.findFirst({
        where: {
          issueId: issueId,
          issueTagOptionId: issueTagOptionId
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return issueTag
  }

  async update(
          prisma: any,
          id: string,
          issueId: string | undefined,
          issueTagOptionId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.issueTag.update({
        data: {
          issueId: issueId,
          issueTagOptionId: issueTagOptionId
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
               issueId: string | undefined,
               issueTagOptionId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // console.log(`${fnName}: starting with id: ${id} issueId: ${issueId} ` +
    //             `issueTagOptionId: ${issueTagOptionId}`)

    // If id isn't specified, try to get by the unique key
    if (id == null &&
        issueId != null &&
        issueTagOptionId != null) {

      const issueTag = await
              this.getByIssueIdAndIssueTagOptionId(
                prisma,
                issueId,
                issueTagOptionId)

      if (issueTag != null) {
        id = issueTag.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (issueId == null) {
        console.error(`${fnName}: id is null and issueId is null`)
        throw 'Prisma error'
      }

      if (issueTagOptionId == null) {
        console.error(`${fnName}: id is null and issueTagOptionId is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 issueId,
                 issueTagOptionId)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 issueId,
                 issueTagOptionId)
    }
  }
}
