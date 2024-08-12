import { BaseDataTypes } from '@/types/base-data-types'
import { VoteModel } from '@/models/voting/vote-model'
import { VoteObjectModel } from '@/models/voting/vote-object-model'
import { VotePublishQueueModel } from '@/models/voting/vote-publish-queue-model'
import { VoteSystemModel } from '@/models/voting/vote-system-model'

export class VotingService {

  // Consts
  clName = 'VotingService'

  // Models
  voteModel = new VoteModel()
  voteObjectModel = new VoteObjectModel()
  votePublishQueueModel = new VotePublishQueueModel()
  voteSystemModel = new VoteSystemModel()

  // Code
  async addObject(
          prisma: any,
          instanceId: string,
          refModel: string,
          refId: string) {

    // Debug
    const fnName = `${this.clName}.addObject()`

    // console.log(`${fnName}: getting the default vote system..`)

    // Get the default vote system
    const voteSystem = await
            this.voteSystemModel.getDefault(prisma)

    if (voteSystem == null) {
      return {
        status: false,
        message: `Can't get the default vote system`
      }
    }

    // Upsert VoteObject record
    const voteObject = await
            this.voteObjectModel.upsert(
              prisma,
              undefined,  // id
              instanceId,
              refModel,
              refId,
              voteSystem.id)
  }

  async votingByRefId(
          prisma: any,
          instanceId: string,
          userProfileId: string,
          refModel: string,
          refId: string) {

    // Debug
    const fnName = `${this.clName}.votingByRefId()`

    // console.log(`${fnName}: starting..`)

    // Get VoteObject
    const voteObject = await
            this.voteObjectModel.getByRefId(
              prisma,
              instanceId,
              refModel,
              refId)

    // Debug
    // console.log(`${fnName}: voteObject: ` + JSON.stringify(voteObject))

    // Get vote options based on the voting system
    var voteOptions: string[] = []

    switch (voteObject.voteSystem.voteTypeSystem) {

      case BaseDataTypes.yesOrNoVotingSystem: {

        voteOptions.push('Yes')
        voteOptions.push('No')
        break
      }

      default: {
        return {
          status: false,
          message: `Unhandled voting system: ${voteObject.voteSystem.voteTypeSystem}`
        }
      }
    }

    // Debug
    // console.log(`${fnName}: getting vote (if any)..`)

    // Get current vote, if any
    const vote = await
            this.voteModel.getByVoteObjectIdAndUserProfileId(
              prisma,
              voteObject.id,
              userProfileId)

    var voted: string | undefined

    if (vote != null) {
      voted = vote.voteType
    }

    // Debug
    // console.log(`${fnName}: returning..`)

    // Return
    return {
      status: true,
      voteOptions: voteOptions,
      voted: voted
    }
  }

  async upsertVote(
          prisma: any,
          instanceId: string,
          userProfileId: string,
          refModel: string,
          refId: string,
          option: string) {

    // Debug
    const fnName = `${this.clName}.upsertVote()`

    console.log(`${fnName}: starting with refMode: ${refModel} ` +
                `refId: ${refId} option: ${option}`)

    // Get the default VoteSystem
    const voteSystem = await
            this.voteSystemModel.getDefault(prisma)

    if (voteSystem == null) {
      return {
        status: false,
        message: 'Default vote system not found'
      }
    }

    // Get VoteObject
    const voteObject = await
            this.voteObjectModel.upsert(
              prisma,
              undefined,  // id
              instanceId,
              refModel,
              refId,
              voteSystem.id)

    // Debug
    console.log(`${fnName}: upserted voteObject: ` +
                JSON.stringify(voteObject))

    // Upsert Vote
    const vote = await
            this.voteModel.upsert(
              prisma,
              undefined,  // id
              instanceId,
              voteObject.id,
              userProfileId,
              undefined,  // voterIdType
              undefined,  // voterId
              option,     // voteType
              new Date())

    // Debug
    console.log(`${fnName}: upserted vote: ` + JSON.stringify(vote))

    // Upsert VotePublishQueue
    const votePublishQueue = await
            this.votePublishQueueModel.upsert(
              prisma,
              undefined,  // id
              instanceId,
              vote.id)

    // Return
    return {
      status: true,
      message: `Vote recorded`
    }
  }
}
