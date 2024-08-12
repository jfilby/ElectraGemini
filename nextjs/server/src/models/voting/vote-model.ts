export class VoteModel {

  // Consts
  clName = 'VoteModel'

  // Code
  async create(
          prisma: any,
          instanceId: string,
          voteObjectId: string,
          userProfileId: string | undefined,
          voterIdType: string | undefined,
          voterId: string | undefined,
          voteType: string | undefined,
          voted: Date | undefined) {

    // Debug
    const fnName = `${this.clName}.create()`

    // console.log(`${fnName}: starting..`)

    // Create record
    try {
      return await prisma.vote.create({
        data: {
          instanceId: instanceId,
          voteObjectId: voteObjectId,
          userProfileId: userProfileId,
          voterIdType: voterIdType,
          voterId: voterId,
          voteType: voteType,
          voted: voted
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

    // Delete record
    try {
      return await prisma.vote.deleteMany({
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
          instanceId: string | undefined,
          voteObjectId: string | undefined,
          userProfileId: string | undefined,
          voterIdType: string | undefined,
          voterId: string | undefined,
          voteType: string | undefined,
          voted: Date | undefined,
          includeVoteObject: boolean = false) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.vote.findMany({
        include: {
          voteObject: includeVoteObject
        },
        where: {
          instanceId: instanceId,
          voteObjectId: voteObjectId,
          userProfileId: userProfileId,
          voterIdType: voterIdType,
          voterId: voterId,
          voteType: voteType,
          voted: voted
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
    var vote: any = null

    try {
      vote = await prisma.vote.findUnique({
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
    return vote
  }

  async getByVoteObjectIdAndUserProfileId(
          prisma: any,
          voteObjectId: string,
          userProfileId: string) {

    // Debug
    const fnName = `${this.clName}.getByVoteObjectIdAndUserProfileId()`

    // Query
    var vote: any = null

    try {
      vote = await prisma.vote.findFirst({
        where: {
          voteObjectId: voteObjectId,
          userProfileId: userProfileId
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return vote
  }

  async getByVoteObjectIdAndVoterIdTypeAndVoterId(
          prisma: any,
          voteObjectId: string,
          voterIdType: string,
          voterId: string) {

    // Debug
    const fnName = `${this.clName}.getByVoteObjectIdAndVoterIdTypeAndVoterId()`

    // Query
    var vote: any = null

    try {
      vote = await prisma.vote.findFirst({
        where: {
          voteObjectId: voteObjectId,
          voterIdType: voterIdType,
          voterId: voterId
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return vote
  }

  async update(
          prisma: any,
          id: string,
          instanceId: string | undefined,
          voteObjectId: string | undefined,
          userProfileId: string | undefined,
          voterIdType: string | undefined,
          voterId: string | undefined,
          voteType: string | undefined,
          voted: Date | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.vote.update({
        data: {
          instanceId: instanceId,
          voteObjectId: voteObjectId,
          userProfileId: userProfileId,
          voterIdType: voterIdType,
          voterId: voterId,
          voteType: voteType,
          voted: voted
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
               voteObjectId: string | undefined,
               userProfileId: string | undefined,
               voterIdType: string | undefined,
               voterId: string | undefined,
               voteType: string | undefined,
               voted: Date | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // console.log(`${fnName}: userProfileId: ${userProfileId}`)

    // Get by voteObjectId and a unique user id (if specified)
    if (id == null &&
        voteObjectId != null) {

      if (userProfileId != null) {

        const vote = await
                this.getByVoteObjectIdAndUserProfileId(
                  prisma,
                  voteObjectId,
                  userProfileId)

        if (vote != null) {
          id = vote.id
        }
      } else if (voterIdType != null &&
                 voterId != null) {

        const vote = await
                this.getByVoteObjectIdAndVoterIdTypeAndVoterId(
                  prisma,
                  voteObjectId,
                  voterIdType,
                  voterId)

        if (vote != null) {
          id = vote.id
        }
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (instanceId == null) {
        console.error(`${fnName}: id is null and instanceId is null`)
        throw 'Prisma error'
      }

      if (voteObjectId == null) {
        console.error(`${fnName}: id is null and voteObjectId is null`)
        throw 'Prisma error'
      }

      if (userProfileId == null &&
          (voterIdType == null &&
           voterId == null)) {

        console.error(
          `${fnName}: id is null and (userProfileId is null and (` +
          `voterIdType == null and voterId == null))`)

        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 instanceId,
                 voteObjectId,
                 userProfileId,
                 voterIdType,
                 voterId,
                 voteType,
                 voted)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 instanceId,
                 voteObjectId,
                 userProfileId,
                 voterIdType,
                 voterId,
                 voteType,
                 voted)
    }
  }
}
