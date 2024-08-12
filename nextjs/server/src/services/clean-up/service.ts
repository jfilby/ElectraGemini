import { SereneAiCleanUpService } from '@/../deployed/serene-ai-server/services/clean-up/service'
import { InstanceChatSessionModel } from '@/models/chats/instance-chat-session-model'
import { InstanceDeleteService } from '@/services/instances/delete-service'

export class CleanUpService {

  // Consts
  clName = 'CleanUp'

  // Models
  instanceChatSessionModel = new InstanceChatSessionModel()

  // Services
  instanceDeleteService = new InstanceDeleteService()
  sereneAiCleanUpService = new SereneAiCleanUpService()

  // Code
  async run(prisma: any) {

    // Get ChatSessions to purge (New status, only and 3 days old or more)
    const purgeChatSessions = await
            this.sereneAiCleanUpService.getChatSessionsToPurge(prisma)

    // Delete ChatInstance records for the ChatSessions to purge
    for (const purgeChatSession of purgeChatSessions) {

      await this.instanceChatSessionModel.deleteByChatSessionId(
              prisma,
              purgeChatSession.id)
    }

    // Serene AI clean-up
    await this.sereneAiCleanUpService.run(
            prisma,
            purgeChatSessions)

    // Delete instances
    await this.instanceDeleteService.deletePending(prisma)
  }
}
