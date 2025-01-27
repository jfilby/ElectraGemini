import { CustomError } from '@/serene-core-server/types/errors'
import { ChatSettingsModel } from '../../models/chat/chat-settings-model'
import { AgentsService } from '../agents/agents-service'
import { ChatService } from './chat-service'
import { LlmUtilsService } from './utils-service'

export class AgentLlmService {

  // Consts
  clName = 'AgentLlmService'

  // Models
  chatSettingsModel = new ChatSettingsModel()

  // Services
  agentsService = new AgentsService()
  chatService = new ChatService()
  llmUtilsService = new LlmUtilsService()

  // Code
  async agentSingleShotLlmRequest(
          prisma: any,
          agentName: string,
          agentRole: string,
          prompt: string,
          jsonMode: boolean) {

    // Single-shot agent LLM request

    // Debug
    const fnName = `${this.clName}.agentSingleShotLlmRequest()`

    // Get or create agent
    const agent = await
            this.agentsService.getOrCreate(
              prisma,
              agentName,
              agentRole)

    // Get LLM tech
    const chatSettingsResults = await
            this.llmUtilsService.getOrCreateChatSettings(
              prisma,
              undefined,  // baseChatSettingsId
              agent.userProfileId,
              undefined,  // prompt
              true)       // getTech

    const tech = chatSettingsResults.tech

    // Build the messages
    const messagesWithRolesFullResults = await
            this.llmUtilsService.buildMessagesWithRolesForSinglePrompt(
              prisma,
              undefined,  // tech
              agent.userProfileId,
              prompt)

    // Make the LLM request
    const chatCompletionResults = await
            this.chatService.llmRequest(
              prisma,
              tech.id,    // llmTechId
              undefined,  // userProfileId
              agent,
              messagesWithRolesFullResults,
              undefined,  // systemPrompt
              jsonMode)

    // Validate
    if (chatCompletionResults.messages == null) {
      throw new CustomError(`${fnName}: no messages`)
    }

    if (jsonMode === true &&
        chatCompletionResults.json == null) {

      throw new CustomError(`${fnName}: expected json`)
    }

    return {
      message: chatCompletionResults.message,
      messages: chatCompletionResults.messages,
      json: chatCompletionResults.json
    }
  }
}
