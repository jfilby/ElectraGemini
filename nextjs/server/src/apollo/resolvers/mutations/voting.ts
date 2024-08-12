import { prisma } from '@/db'
import { CustomError } from '@/serene-core-server/types/errors'
import { UsersService } from '@/serene-core-server/services/users/service'
import { VotingService } from '@/services/voting/service'

// Services
const usersService = new UsersService()
const votingService = new VotingService()

// Code
export async function upsertVote(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  const fnName = `upsertVote()`

  // console.log(`${fnName}: args: ` + JSON.stringify(args))

  // Debug
  console.log(`${fnName}: calling usersService.getById()..`)

  // Verify that the user is signed-in
  const signedInUserProfile = await
          usersService.verifySignedInUserProfileId(
            prisma,
            args.userProfileId)

  if (signedInUserProfile === false) {

    return {
      status: false,
      message: `You need to be signed-in to vote.`
    }
  }

  // Upsert vote
  var results: any

  try {
    results = await
      votingService.upsertVote(
        prisma,
        args.instanceId,
        args.userProfileId,
        args.refModel,
        args.refId,
        args.option)
  } catch (error) {
    if (error instanceof CustomError) {
      return {
        status: false,
        message: error.message
      }
    } else {
      return {
        status: false,
        message: `Unexpected error: ${error}`
      }
    }
  }

  // Return
  return results
}
