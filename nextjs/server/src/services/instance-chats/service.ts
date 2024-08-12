import { CustomError } from '@/serene-core-server/types/errors'
import { AiTechDefs } from '@/serene-ai-server/types/tech-defs'
import { ChatSettingsModel } from '@/serene-ai-server/models/chat/chat-settings-model'
import { ChatSessionService } from '@/serene-ai-server/services/chats/sessions/chat-session-service'
import { LlmUtilsService } from '@/serene-ai-server/services/llm-apis/utils-service'
import { BaseDataTypes } from '@/types/base-data-types'
import { InstanceChatSessionModel } from '@/models/chats/instance-chat-session-model'
import { IssueModel } from '@/models/issues/issue-model'
import { KbFileContentModel } from '@/models/kb/kb-file-content-model'
import { KbFileExtractModel } from '@/models/kb/kb-file-extract-model'
import { NewsArticleIssueModel } from '@/models/news-articles/news-article-issue-model'
import { ProposalModel } from '@/models/proposals/proposal-model'

export class InstanceChatsService {

  // Debug
  clName = 'InstanceChatsService'

  // Models
  chatSettingsModel = new ChatSettingsModel()
  instanceChatSessionModel = new InstanceChatSessionModel()
  issueModel = new IssueModel()
  kbFileContentModel = new KbFileContentModel()
  kbFileExtractModel = new KbFileExtractModel()
  llmUtilsService = new LlmUtilsService()
  newsArticleIssueModel = new NewsArticleIssueModel()
  proposalModel = new ProposalModel()

  // Services
  chatSessionService = new ChatSessionService()

  // Code
  async getInstanceChatSessions(
          prisma: any,
          instanceId: string,
          userProfileId: string,
          status: string) {

    // Get all InstanceChatSession records for the instance and user
    var chatSessions = await
          this.instanceChatSessionModel.filterChatSession(
            prisma,
            instanceId,
            userProfileId,
            status)

    // Prep chat sessions for return
    chatSessions = await
      this.chatSessionService.prepChatSessionsForReturn(
        prisma,
        chatSessions)

    // Return
    return chatSessions
  }

  async getIssueAndProposal(
          prisma: any,
          issueId: string | undefined,
          proposalId: string | undefined) {

    var issue: any = null
    var proposal: any = null

    // Get the current proposal (if set)
    if (proposalId != null) {

      proposal = await
        this.proposalModel.getById(
          prisma,
          proposalId,
          true)  // includeKbFile

      // Put name under the proposal var (for GraphQL expected format)
      proposal.name = proposal.kbFile.name

      // If proposalId is specified, but not issueId, then get the issueId
      if (issueId == null) {
        issueId = proposal.issueId
      }
    }

    // Get the current issue (if set)
    if (issueId != null) {

      issue = await
        this.issueModel.getById(
          prisma,
          issueId,
          true)  // includeKbFile

      // Put name under the issue var (for GraphQL expected format)
      issue.name = issue.kbFile.name
    }

    // Return
    return {
      issue: issue,
      proposal: proposal
    }
  }

  async getIssuesCascadeForPrompt(
          prisma: any,
          tech: any,
          instanceId: string,
          thisIssue: any,
          thisProposal: any) {

    // Debug
    const fnName = `${this.clName}.getIssuesCascadeForPrompt()`

    console.log(`${fnName}: starting..`)

    // Context size
    const maxInputSize =
            AiTechDefs.variantToMaxInputTokens[tech.variantName] *
            0.75

    var largeContextSize = false

    if (AiTechDefs.variantToMaxInputTokens[tech.variantName] >=
        AiTechDefs.largeContextTokenSize) {

      largeContextSize = true
    }

    // Prompt var
    var prompt = ''

    // Get the current proposal (if set)
    if (thisProposal != null) {

      prompt += `The current proposal for discussion is: ` +
                `${thisProposal.name}\n`
    }

    // Get the current issue (if set)
    if (thisIssue != null) {

      prompt += `The current issue for discussion is: ` +
                `${thisIssue.name}\n`
    }

    // Contextualize the issues and proposals that follow
    prompt += `For context, a full list of the issues and proposals for ` +
              `each one follow:\n`

    // Get all issues
    const issuesResults = await
            this.issueModel.filter(
              prisma,
              instanceId,
              undefined,  // kbFileId
              undefined,  // tag
              undefined,  // page
              undefined,  // pageSize
              true)       // includeKbFile

    for (const issue of issuesResults.issues) {

      // Get content of the issue
      const issueKbFileContent = await
        this.kbFileContentModel.getByKbFileId(
          prisma,
          issue.kbFileId)

      // Current issue?
      var currentIssue = ''

      if (thisIssue != null) {
        if (issue.id === thisIssue.id) {
          currentIssue = ` (current issue to discuss)`
        }
      }

      // Add to prompt
      prompt += `Issue: ${issue.kbFile.name}${currentIssue}`

      if (largeContextSize === true) {

        prompt +=
          `:\n` +
          `${BaseDataTypes.textDelimiter}\n` +
          `${issueKbFileContent.text}\n` +
          `${BaseDataTypes.textDelimiter}\n`
      } else {
        prompt += '\n'
      }

      // Get news articles for issue (if using a model with enough context)
      if (largeContextSize === true) {

        const newsIssues = await
                this.newsArticleIssueModel.getByIssueId(
                  prisma,
                  issue.id,
                  true)  // includeNewsArticle

        for (const newsIssue of newsIssues) {

          // Add to prompt
          prompt +=
              `News headline for the issue:\n` +
              `${BaseDataTypes.textDelimiter}` +
              `${newsIssue.newsArticle.title}` +
              `${BaseDataTypes.textDelimiter}\n`
        }
      }

      // Get proposals
      const proposalsResults = await
              this.proposalModel.filter(
                prisma,
                instanceId,
                undefined,  // kbFileId
                undefined,  // tag
                undefined,  // page
                undefined,  // pageSize
                issue.id,
                true)       // includeKbFile

      for (const proposal of proposalsResults.proposals) {

        // Get content of the proposal
        const proposalKbFileContent = await
          this.kbFileContentModel.getByKbFileId(
            prisma,
            proposal.kbFileId)

        // Current proposal?
        var currentProposal = ''

        if (thisProposal != null) {
          if (proposal.id === thisProposal.id) {
            currentProposal = ` (current issue to discuss)`
          }
        }

        // Add to prompt
        prompt +=
            `Proposal for the issue: ${proposal.kbFile.name}${currentProposal}`

        if (largeContextSize === true) {

          prompt +=
            `:\n` +
            `${BaseDataTypes.textDelimiter}\n` +
            `${proposalKbFileContent.text}\n` +
            `${BaseDataTypes.textDelimiter}\n`
        } else {
          prompt += '\n'
        }
      }
    }

    // Truncate the prompt if necessary
    if (prompt.length > maxInputSize) {

      prompt = prompt.substring(0, maxInputSize)
    }

    // Return
    console.log(`${fnName}: returning..`)

    return {
      prompt: prompt,
      issue: thisIssue,
      proposal: thisProposal
    }
  }

  async getOrCreateChatSession(
          prisma: any,
          instanceId: string,
          userProfileId: string,
          issueId: string | undefined,
          proposalId: string | undefined,
          chatSessionId: string | undefined,
          chatSettingsName: string) {

    // Debug
    const fnName = `${this.clName}.getOrCreateChatSession()`

    console.log(`${fnName}: starting with instanceId: ${instanceId} ` +
                `userProfileId: ${userProfileId} ` +
                `chatSessionId: ${chatSessionId} `)

    // Issue and proposal vars
    var thisIssue: any = null
    var thisProposal: any = null

    // Get InstanceChat and related records
    var instanceChatSession: any

    if (chatSessionId != null) {

      instanceChatSession = await
        this.instanceChatSessionModel.getByNonPkFields(
          prisma,
          instanceId,
          userProfileId,
          chatSessionId,
          false)  // includeChatSession

      // Debug
      // console.log(`${fnName}: instanceChatSession: ` +
      //             JSON.stringify(instanceChatSession))

      // Return if record(s) exist
      if (instanceChatSession != null) {

        if (instanceChatSession.issueId != null ||
          instanceChatSession.proposalId != null) {
      
          const issueAndProposalResults = await
                  this.getIssueAndProposal(
                    prisma,
                    instanceChatSession.issueId,
                    instanceChatSession.proposalId)

          thisIssue = issueAndProposalResults.issue
          thisProposal = issueAndProposalResults.proposal
        }

        if (instanceChatSession.chatSessionId != null) {

          // Validate
          if (chatSessionId !== instanceChatSession.chatSessionId) {
            throw new CustomError(`${fnName}: chatSessionId !== instanceChatSession.chatSessionId`)
          }

          // Get chatSession
          const chatSessionResults = await
                  this.chatSessionService.getChatSessionById(
                    prisma,
                    chatSessionId,
                    userProfileId)

          // Debug
          console.log(`${fnName}: returning with existing chatSession..`)

          // Formulate return var
          var chatSession = chatSessionResults.chatSession

          chatSession.issue = thisIssue
          chatSession.proposal = thisProposal

          // Return
          return {
            status: true,
            chatSession: chatSession
          }
        }
      }
    }

    // Get base ChatSettings record
    const baseChatSettings = await
            this.chatSettingsModel.getByName(
              prisma,
              chatSettingsName)

    if (baseChatSettings == null) {
      throw new CustomError(`${fnName}: baseChatSettings == null`)
    }

    // Debug
    console.log(`${fnName}: baseChatSettings: ` +
                JSON.stringify(baseChatSettings))

    // Get issue and proposal
    if (issueId != null ||
        proposalId != null) {
      
      const issueAndProposalResults = await
              this.getIssueAndProposal(
                prisma,
                issueId,
                proposalId)

      thisIssue = issueAndProposalResults.issue
      thisProposal = issueAndProposalResults.proposal
    }

    // Debug
    console.log(`${fnName}: creating chatSession..`)

    // Determine the name of the chat session
    var name = ``

    if (thisIssue != null) {
      name = `Issue: ${thisIssue.name}`
    }

    if (thisProposal != null) {
      if (thisIssue != null) {
        name += ` and proposal: ${thisProposal.name}`
      } else {
        name = `Proposal: ${thisProposal.name}`
      }
    }

    // Debug
    console.log(`${fnName}: Getting tech with baseChatSettings: ` +
                JSON.stringify(baseChatSettings))

    // Get Tech
    const tech = await
            this.llmUtilsService.getTech(
              prisma,
              baseChatSettings)

    // Debug
    console.log(`${fnName}: tech: ` + JSON.stringify(tech))

    // Formulate prompt
    var promptResults = await
          this.getIssuesCascadeForPrompt(
            prisma,
            tech,
            instanceId,
            thisIssue,
            thisProposal)

    var prompt = promptResults.prompt

    // Get the prompt snippet from relevant KB docs
    const kbFileExtract = await
            this.kbFileExtractModel.getByInstanceIdAndPurpose(
              prisma,
              instanceId,
              BaseDataTypes.issueAndProposalGenerationPurpose)

    if (kbFileExtract != null) {

      prompt += kbFileExtract.text + `\n`
    }

    // Debug
    console.log(`${fnName}: creating ChatSession..`)

    // Create ChatSession
    const chatSessionResults = await
            this.chatSessionService.createChatSession(
              prisma,
              baseChatSettings.id,
              userProfileId,
              prompt,
              name)

    // Debug
    console.log(`${fnName}: creating InstanceChatSession..`)

    // Create InstanceChat record
    instanceChatSession = await
      this.instanceChatSessionModel.create(
        prisma,
        instanceId,
        userProfileId,
        chatSessionResults.chatSession.id,
        issueId,
        proposalId)

    // Debug
    console.log(`${fnName}: created chatSession: ` +
                JSON.stringify(chatSessionResults.chatSession))

    // Formulate return var
    var chatSession = chatSessionResults.chatSession

    chatSession.issue = thisIssue
    chatSession.proposal = thisProposal

    // Return
    return {
      status: true,
      chatSession: chatSession
    }
  }
}
