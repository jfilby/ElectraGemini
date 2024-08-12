import { prisma } from '@/db'
import { CustomError } from '@/serene-core-server/types/errors'
import { InstanceChatsService } from '@/services/instance-chats/service'

const instanceChatsService = new InstanceChatsService()

export async function getInstanceChatSessions(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  const fnName = `getInstanceChatSessions()`

  // console.log(`${fnName}: args: ` + JSON.stringify(args))

  var results: any

  try {
    results = await
      instanceChatsService.getInstanceChatSessions(
        prisma,
        args.instanceId,
        args.userProfileId,
        args.status)
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
  // console.log(`${fnName}: results: ` + JSON.stringify(results))

  // Return
  return results
}
