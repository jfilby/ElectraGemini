export class ProposalTagModel {

  // Consts
  clName = 'ProposalTagModel'

  // Code
  async create(
          prisma: any,
          proposalId: string,
          proposalTagOptionId: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.proposalTag.create({
        data: {
          proposalId: proposalId,
          proposalTagOptionId: proposalTagOptionId
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
      return await prisma.proposalTag.delete({
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

  async deleteByProposalId(
          prisma: any,
          proposalId: string) {

    // Debug
    const fnName = `${this.clName}.deleteByProposalId()`

    // Delete
    try {
      return await prisma.proposalTag.deleteMany({
        where: {
          proposalId: proposalId
        }
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async deleteByProposalTagOptionId(
          prisma: any,
          proposalTagOptionId: string) {

    // Debug
    const fnName = `${this.clName}.deleteByProposalTagOptionId()`

    // Delete
    try {
      return await prisma.proposalTag.deleteMany({
        where: {
          proposalTagOptionId: proposalTagOptionId
        }
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async filter(
          prisma: any,
          proposalId: string | undefined,
          proposalTagOptionId: string | undefined,
          orderByName: boolean = false) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.proposalTag.findMany({
        where: {
          proposalId: proposalId,
          proposalTagOptionId: proposalTagOptionId
        },
        orderBy: orderByName ? {
          proposalTagOption: {
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
          includeProposalTagOption: boolean = false) {

    // Debug
    const fnName = `${this.clName}.getById()`

    // Query
    var proposalTag: any = null

    try {
      proposalTag = await prisma.proposalTag.findUnique({
        include: {
          includeProposalTagOption: includeProposalTagOption
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
    return proposalTag
  }

  async getByProposalIdAndProposalTagOptionId(
          prisma: any,
          proposalId: string,
          proposalTagOptionId: string) {

    // Debug
    const fnName = `${this.clName}.getByProposalIdAndProposalTagOptionId()`

    // Query
    var proposalTag: any = null

    try {
      proposalTag = await prisma.proposalTag.findFirst({
        where: {
          proposalId: proposalId,
          proposalTagOptionId: proposalTagOptionId
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return proposalTag
  }

  async update(
          prisma: any,
          id: string,
          proposalId: string | undefined,
          proposalTagOptionId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.proposalTag.update({
        data: {
          proposalId: proposalId,
          proposalTagOptionId: proposalTagOptionId
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
               proposalId: string | undefined,
               proposalTagOptionId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // console.log(`${fnName}: starting with id: ${id} proposalId: ${proposalId} ` +
    //             `proposalTagOptionId: ${proposalTagOptionId}`)

    // If id isn't specified, try to get by the unique key
    if (id == null &&
        proposalId != null &&
        proposalTagOptionId != null) {

      const proposalTag = await
              this.getByProposalIdAndProposalTagOptionId(
                prisma,
                proposalId,
                proposalTagOptionId)

      if (proposalTag != null) {
        id = proposalTag.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (proposalId == null) {
        console.error(`${fnName}: id is null and proposalId is null`)
        throw 'Prisma error'
      }

      if (proposalTagOptionId == null) {
        console.error(`${fnName}: id is null and proposalTagOptionId is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 proposalId,
                 proposalTagOptionId)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 proposalId,
                 proposalTagOptionId)
    }
  }
}
