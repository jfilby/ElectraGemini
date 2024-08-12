export class ProposalPublishedModel {

  // Consts
  clName = 'ProposalPublishedModel'

  // Code
  async create(
          prisma: any,
          instanceId: string,
          proposalId: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // console.log(`${fnName}: starting..`)

    // Create record
    try {
      return await prisma.proposalPublished.create({
        data: {
          instanceId: instanceId,
          proposalId: proposalId
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async deleteByInstanceId(
          prisma: any,
          instanceId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.deleteByInstanceId()`

    // Delete records
    try {
      return await prisma.proposalPublished.deleteMany({
        where: {
          instanceId: instanceId
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async exists(
          prisma: any,
          proposalId: string) {

    // Debug
    const fnName = `${this.clName}.exists()`

    // Query
    const proposalPublished = await
            this.getByProposalId(
              prisma,
              proposalId)

    // Return
    if (proposalPublished != null) {
      return true
    } else {
      return false
    }
  }

  async filter(
          prisma: any,
          instanceId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.proposalPublished.findMany({
        include: {
          proposal: true
        },
        where: {
          instanceId: instanceId
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
    var proposalPublished: any = null

    try {
      proposalPublished = await prisma.proposalPublished.findUnique({
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
    return proposalPublished
  }

  async getByProposalId(
          prisma: any,
          proposalId: string) {

    // Debug
    const fnName = `${this.clName}.getByProposalId()`

    // Query
    var proposalPublished: any = null

    try {
      proposalPublished = await prisma.proposalPublished.findUnique({
        where: {
          proposalId: proposalId
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return proposalPublished
  }

  async update(
          prisma: any,
          id: string,
          instanceId: string | undefined,
          proposalId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.proposalPublished.update({
        data: {
          instanceId: instanceId,
          proposalId: proposalId
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
               proposalId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // Get by proposalId (if specified)
    if (id == null &&
        proposalId != null) {

      const proposalPublished = await
              this.getByProposalId(
                prisma,
                proposalId)

      if (proposalPublished != null) {
        id = proposalPublished.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (instanceId == null) {
        console.error(`${fnName}: id is null and instanceId is null`)
        throw 'Prisma error'
      }

      if (proposalId == null) {
        console.error(`${fnName}: id is null and proposalId is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 instanceId,
                 proposalId)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 instanceId,
                 proposalId)
    }
  }
}
