export class VotePublishQueueModel {

  // Consts
  clName = 'VotePublishQueueModel'

  // Code
  async create(
          prisma: any,
          instanceId: string,
          voteId: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // console.log(`${fnName}: starting..`)

    // Create record
    try {
      return await prisma.votePublishQueue.create({
        data: {
          instanceId: instanceId,
          voteId: voteId
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
      return await prisma.votePublishQueue.deleteMany({
        where: {
          instanceId: instanceId
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async filter(
          prisma: any,
          instanceId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.votePublishQueue.findMany({
        include: {
          vote: {
            include: {
              voteObject: true
            }
          }
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
    var votePublishQueue: any = null

    try {
      votePublishQueue = await prisma.votePublishQueue.findUnique({
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
    return votePublishQueue
  }

  async getByVoteId(
          prisma: any,
          voteId: string) {

    // Debug
    const fnName = `${this.clName}.getByVoteId()`

    // Query
    var votePublishQueue: any = null

    try {
      votePublishQueue = await prisma.votePublishQueue.findUnique({
        where: {
          voteId: voteId
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return votePublishQueue
  }

  async update(
          prisma: any,
          id: string,
          instanceId: string | undefined,
          voteId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.votePublishQueue.update({
        data: {
          instanceId: instanceId,
          voteId: voteId
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
               voteId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // Get by voteId (if specified)
    if (id == null &&
        voteId != null) {

      const votePublishQueue = await
              this.getByVoteId(
                prisma,
                voteId)

      if (votePublishQueue != null) {
        id = votePublishQueue.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (instanceId == null) {
        console.error(`${fnName}: id is null and instanceId is null`)
        throw 'Prisma error'
      }

      if (voteId == null) {
        console.error(`${fnName}: id is null and voteId is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 instanceId,
                 voteId)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 instanceId,
                 voteId)
    }
  }
}
