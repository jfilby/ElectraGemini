import { VoteModel } from './vote-model'
import { VotePublishQueueModel } from './vote-publish-queue-model'

export class VoteObjectModel {

  // Consts
  clName = 'VoteObjectModel'

  // Models
  voteModel = new VoteModel()
  votePublishQueueModel = new VotePublishQueueModel()

  // Code
  async countVotesByRefId(
          prisma: any,
          refModel: string,
          refId: string) {

    // Debug
    const fnName = `${this.clName}.countVotesByRefId()`

    // Query
    var voteObject: any = null

    try {
      voteObject = await prisma.voteObject.findFirst({
        include: {
          _count: {
            select: {
              ofVotes: true
            }
          }
        },
        where: {
          refModel: refModel,
          refId: refId
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Debug
    // console.log(`${fnName}: refModel: ${refModel} refId: ${refId} ` +
    //             `voteObject: ` + JSON.stringify(voteObject))

    // Return
    return voteObject
  }

  async create(
          prisma: any,
          instanceId: string,
          refModel: string,
          refId: string,
          voteSystemId: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.voteObject.create({
        data: {
          instanceId: instanceId,
          refModel: refModel,
          refId: refId,
          voteSystemId: voteSystemId
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async deleteByInstanceIdCascade(
          prisma: any,
          instanceId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.deleteByInstanceIdCascade()`

    // Deleted queued votes
    await this.votePublishQueueModel.deleteByInstanceId(
            prisma,
            instanceId)

    // Delete votes
    await this.voteModel.deleteByInstanceId(
            prisma,
            instanceId)

    // Delete record
    try {
      return await prisma.voteObject.deleteMany({
        where: {
          instanceId: instanceId
        }
      })
    } catch(error) {
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
    var voteObject: any = null

    try {
      voteObject = await prisma.voteObject.findUnique({
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
    return voteObject
  }

  async getByRefId(
          prisma: any,
          instanceId: string,
          refModel: string,
          refId: string,
          includeVoteSystem: boolean = true) {

    // Debug
    const fnName = `${this.clName}.getById()`

    // Query
    var voteObject: any = null

    try {
      voteObject = await prisma.voteObject.findFirst({
        include: {
          voteSystem: includeVoteSystem
        },
        where: {
          instanceId: instanceId,
          refModel: refModel,
          refId: refId
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return voteObject
  }

  async update(
          prisma: any,
          id: string,
          instanceId: string | undefined,
          refModel: string | undefined,
          refId: string | undefined,
          voteSystemId: string) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.voteObject.update({
        data: {
          instanceId: instanceId,
          refModel: refModel,
          refId: refId,
          voteSystemId: voteSystemId
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
               refModel: string | undefined,
               refId: string | undefined,
               voteSystemId: string) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (instanceId == null) {
        console.error(`${fnName}: id is null and instanceId is null`)
        throw 'Prisma error'
      }

      if (refModel == null) {
        console.error(`${fnName}: id is null and refModel is null`)
        throw 'Prisma error'
      }

      if (refId == null) {
        console.error(`${fnName}: id is null and refId is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 instanceId,
                 refModel,
                 refId,
                 voteSystemId)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 instanceId,
                 refModel,
                 refId,
                 voteSystemId)
    }
  }
}
