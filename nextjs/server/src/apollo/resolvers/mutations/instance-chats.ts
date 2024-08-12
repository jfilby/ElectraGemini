import { prisma } from '@/db'
import { CustomError } from '@/serene-core-server/types/errors'
import { InstanceChatsService } from '@/services/instance-chats/service'


// Services
const instanceChatsService = new InstanceChatsService()


// Code
export async function getOrCreateInstanceChatSession(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  const fnName = `getOrCreateInstanceChatSession()`

  console.log(`${fnName}: args: ` + JSON.stringify(args))

  // Get/create transaction
  var results: any

  await prisma.$transaction(async (transactionPrisma: any) => {

    try {
      results = await
        instanceChatsService.getOrCreateChatSession(
          transactionPrisma,
          args.instanceId,
          args.userProfileId,
          args.issueId,
          args.proposalId,
          args.chatSessionId,
          'Default')  // chatSettingsName
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
  })

  // Debug
  console.log(`${fnName}: results: ${JSON.stringify(results)}`)

  // Return
  return results
}
