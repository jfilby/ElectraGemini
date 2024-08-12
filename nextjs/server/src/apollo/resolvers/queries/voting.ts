import { prisma } from '@/db'
import { CustomError } from '@/serene-core-server/types/errors'
import { VotingService } from '@/services/voting/service'

// Services
const votingService = new VotingService()

// Code
export async function votingByRefId(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  const fnName = `votingByRefId()`

  console.log(`${fnName}: args: ` + JSON.stringify(args))

  // Get voting data
  var results: any

  try {
    results = await
      votingService.votingByRefId(
        prisma,
        args.instanceId,
        args.userProfileId,
        args.refModel,
        args.refId)
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

  // Debug
  console.log(`${fnName}: results: ` + JSON.stringify(results))

  // Return
  return results
}
