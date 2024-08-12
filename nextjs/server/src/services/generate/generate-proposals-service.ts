import { CustomError } from '@/serene-core-server/types/errors'
import { AiTechDefs } from '@/serene-ai-server/types/tech-defs'
import { AgentsService } from '@/serene-ai-server/services/agents/agents-service'
import { LlmUtilsService } from '@/serene-ai-server/services/llm-apis/utils-service'
import { BaseDataTypes } from '@/types/base-data-types'
import { InstanceModel } from '@/models/instances/instance-model'
import { IssueModel } from '@/models/issues/issue-model'
import { KbFileContentModel } from '@/models/kb/kb-file-content-model'
import { KbFileExtractModel } from '@/models/kb/kb-file-extract-model'
import { NewsArticleIssueModel } from '@/models/news-articles/news-article-issue-model'
import { ProposalModel } from '@/models/proposals/proposal-model'
import { ProposalTagModel } from '@/models/proposals/proposal-tag-model'
import { ProposalTagOptionModel } from '@/models/proposals/proposal-tag-option-model'
import { ChatService } from '@/serene-ai-server/services/llm-apis/chat-service'
import { ChatSessionService } from '@/serene-ai-server/services/chats/sessions/chat-session-service'
import { TextParsingService } from '@/serene-ai-server/services/content/text-parsing-service'
import { IssueService } from '../issues/service'
import { ProposalService } from '../proposals/service'

export class GenerateProposalsService {

  // Consts
  clName = 'GenerateProposalsService'

  // Settings
  maxGeneratedTags = Number(process.env.NEXT_PUBLIC_MAX_GENERATED_TAGS)
  maxGeneratedProposalsPerIssue = Number(process.env.NEXT_PUBLIC_MAX_GENERATED_PROPOSALS_PER_ISSUE)

  // Models
  instanceModel = new InstanceModel()
  issueModel = new IssueModel()
  kbFileContentModel = new KbFileContentModel()
  kbFileExtractModel = new KbFileExtractModel()
  newsArticleIssueModel = new NewsArticleIssueModel()
  proposalModel = new ProposalModel()
  proposalTagModel = new ProposalTagModel()
  proposalTagOptionModel = new ProposalTagOptionModel()

  // Services
  agentsService = new AgentsService()
  chatService = new ChatService()
  chatSessionService = new ChatSessionService()
  issueService = new IssueService()
  llmUtilsService = new LlmUtilsService()
  proposalService = new ProposalService()
  textParsingService = new TextParsingService()

  // Code
  async generate(
          prisma: any,
          instance: any) {

    // Debug
    const fnName = `${this.clName}.generate()`

    // Get or create agent
    const agent = await
            this.agentsService.getOrCreate(
              prisma,
              BaseDataTypes.agentName,
              BaseDataTypes.agentRole)

    // Get LLM tech
    const chatSettingsResults = await
            this.llmUtilsService.getOrCreateChatSettings(
              prisma,
              undefined,  // baseChatSettingsId
              agent.userProfileId,
              undefined,  // prompt
              true)       // getTech

    const tech = chatSettingsResults.tech

    // Get issues that need proposals generated
    const issueOfNewsArticles = await
            this.newsArticleIssueModel.getDistinctIssuesByInstanceIdAndBatchProcessed(
              prisma,
              instance.id,
              false)

    // Debug
    console.log(`${fnName}: issueOfNewsArticles: ` +
                JSON.stringify(issueOfNewsArticles))

    // Generate proposals for each issue
    var proposalSets: any[] = []

    for (const issueOfNewsArticle of issueOfNewsArticles) {

      // Get Issue record
      const issue = await
              this.issueModel.getById(
                prisma,
                issueOfNewsArticle.issueId)

      // Validate
      if (issue == null) {

        throw new CustomError(`${fnName}: issue == null for id: ` +
                              JSON.stringify(issueOfNewsArticle.issueId))
      }

      // Get issue results
      const issueResults = await
              this.issueService.getById(
                prisma,
                issue.id,
                issue.instanceId,
                agent.userProfileId,
                false,  // includeTags
                false,  // includeProposalCount
                true,   // includeProposals
                false)  // verifyAccess

      // Validate
      if (issueResults.issue == null) {

        throw new CustomError(`${fnName}: issueResults.issue == null for` +
                              ` id: ${issue.id}`)
      }

      /* Get proposal tag options for the instance
      const proposalTagOptions = await
              this.proposalTagOptionModel.filter(
                prisma,
                undefined,  // parentId
                instance.id,
                true)       // orderByName */

      // Listing existing tags not found useful in testing, and uses up a lot of
      // the LLM context window.
      const proposalTagOptions: any[] = []

      // Generate proposals
      const proposalResults = await
              this.generateProposalsForIssue(
                prisma,
                tech,
                agent,
                instance.id,
                instance.legalGeo.country2LetterCode,
                proposalTagOptions,
                issueResults.issue,
                issueResults.issue.proposals)

      // Add to proposals
      proposalSets.push({
        issueId: issue.id,
        instanceId: issue.instanceId,
        userProfileId: agent.userProfileId,
        proposals: proposalResults.proposals
      })

      // Progress debug
      console.log(`${fnName}: added proposalDetails ${proposalSets.length} ` +
                  `of ${issueOfNewsArticles.length}`)
    }

    // Return
    return {
      status: true,
      proposalSets: proposalSets
    }
  }

  async generateProposalsForIssue(
          prisma: any,
          tech: any,
          agent: any,
          instanceId: string,
          country2LetterCode: string,
          proposalTagOptions: string[],
          issue: any,
          existingProposals: any[]) {

    // Debug
    const fnName = `${this.clName}.generateProposalsForIssue()`

    // console.log(`${fnName}: starting with issue: ` +
    //             JSON.stringify(issue))

    // Get the existing proposals count for the issue
    const existingProposalsCount = await
            this.proposalModel.countByIssueId(
              prisma,
              issue.id)

    // Return if a new proposal would be created and the max generated
    // proposals for this issue has already been reached
    if (existingProposalsCount >= this.maxGeneratedProposalsPerIssue) {
      return {
        status: true,
        proposals: []
      }
    }

    // Formulate the prompt
    const prompt = await
            this.getGenerateProposalsPrompt(
              prisma,
              instanceId,
              tech,
              country2LetterCode,
              proposalTagOptions,
              issue,
              existingProposals)

    // console.log(`${fnName}: prompt: ` + JSON.stringify(prompt))

    // Debug
    // throw new CustomError(`${fnName}: testing`)

    // Build the messages
    const messagesWithRolesFullResults = await
            this.llmUtilsService.buildMessagesWithRolesForSinglePrompt(
              prisma,
              undefined,  // tech
              agent.userProfileId,
              prompt)

    // console.log(`${fnName}: messagesWithRolesFullResults: ` +
    //             JSON.stringify(messagesWithRolesFullResults))

    // Make the LLM request
    const chatCompletionResults = await
            this.chatService.llmRequest(
              prisma,
              tech.id,    // llmTechId
              undefined,  // userProfileId
              agent,
              messagesWithRolesFullResults,
              undefined,  // systemPrompt
              true)       // jsonMode

    // Validate
    if (chatCompletionResults.messages == null) {
      throw new CustomError(`${fnName}: no messages`)
    }

    if (chatCompletionResults.json == null) {
      throw new CustomError(`${fnName}: no json`)
    }

    // Debug
    // console.log(`${fnName}: results: ` + JSON.stringify(results))

    // Return
    return {
      status: true,
      message: undefined,
      proposals: chatCompletionResults.json.proposals
    }
  }

  async getGenerateProposalsPrompt(
          prisma: any,
          instanceId: string,
          tech: any,
          country2LetterCode: string,
          proposalTagOptions: any[],
          issue: any,
          existingProposals: any[]) {

    // Debug
    const fnName = `${this.clName}.getGenerateIssuesPrompt()`

    // console.log(`${fnName}: starting..`)

    // Initial role with instructions
    var prompt =
          `Your role is a political analyst. You need to identify a set of ` +
          `proposals to address the issue presented. But reuse existing ` +
          `proposals where possible, just update the content.\n` +
          `You need to analyze and write from the perspective of the ` +
          `country with code: ${country2LetterCode}\n`

    // Expected format
    // The (not Javascript) snippet is to avoid some models trying to
    // instantiate a string, breaking the JSON format.
    prompt +=
      `Return the results in JSON format (not Javascript) without comments. ` +
      `Here's an example:\n` +
      `{\n` +
      `  proposals: [\n` +
      `    {\n` +
      `      id: "123",\n` +
      `      name: "Subsidies for solar panels",\n` +
      `      text: "To combat climate change..",\n` +
      `      tags: ["climate change"]\n` +
      `    }\n` +
      `  ]\n` +
      `}\n` +
      `\n` +
      `Note that:\n` +
      `- The id for updating answers should only be specified if taken from ` +
      `  an existing issue to be merged with. This is a CUID that you should ` +
      `  only obtain from the list of existing proposals given.\n` +
      `- If no id is specified then the value should be null.\n` +
      `- You should write extensive text for each answer, of at least one ` +
      `  paragraph, preferably more.\n` +
      `\n`

    // Issue
    prompt +=
      `The issue is named ${issue.kbFile.name}.`

    if (issue.kbFileContent != null) {
      if (issue.kbFileContent.text != null) {

        prompt += `The content: ${BaseDataTypes.textDelimiter}\n` +
                  `${issue.kbFileContent.text}\n` +
                  `${BaseDataTypes.textDelimiter}\n`
      }
    }

    prompt += `\n`


    // Add proposal tags
    prompt +=
      `The proposals of interest are categorized by tags, you should list the ` +
      `relevant tags per proposal. Try not to create tags that are only ` +
      `slightly different and look like duplicates.\n`

    /* if (proposalTagOptions.length > 0) {

      prompt += `The existing tags are:\n`

      for (const proposalTagOption of proposalTagOptions) {

        prompt += `- ${proposalTagOption.name}\n`
      }
    } */

    // Get the prompt snippet from relevant KB docs
    const kbFileExtract = await
            this.kbFileExtractModel.getByInstanceIdAndPurpose(
              prisma,
              instanceId,
              BaseDataTypes.issueAndProposalGenerationPurpose)

    if (kbFileExtract != null) {

      prompt += kbFileExtract.text + `\n`
    }

    // Proposals that already exist
    if (existingProposals.length > 0) {

      prompt +=
        `Here are a list of existing proposals. It could be helpful to merge ` +
        `any similar proposals into existing ones, but update their content.\n`
    }

    for (const existingProposal of existingProposals) {

      prompt += `Propsal with id: ${existingProposal.id} and name: ` +
                `${existingProposal.kbFile.name}.`

      // Only include content if using a model that supports large input tokens
      if (AiTechDefs.variantToMaxInputTokens[tech.variantName] >=
          AiTechDefs.largeContextTokenSize &&
          existingProposal.kbFileContent != null) {
        if (existingProposal.kbFileContent.text != null) {

          prompt += ` Content: ${BaseDataTypes.textDelimiter}\n` +
                    `${existingProposal.kbFileContent.text}\n` +
                    `${BaseDataTypes.textDelimiter}\n`
        }
      }

      prompt += `\n`
    }

    // Return
    return prompt
  }

  async save(
          prisma: any,
          results: any) {

    // Debug
    const fnName = `${this.clName}.save()`

    // console.log(`${fnName}: results: ` + JSON.stringify(results))

    // Process all proposal details
    var issueIds: string[] = []
    var i = 0

    for (const proposalDetails of results.proposalSets) {

      // Ignore null proposals
      if (proposalDetails.proposals == null) {
        continue
      }

      // Save each proposal
      for (const proposal of proposalDetails.proposals) {

        await this.saveProposal(
                prisma,
                proposalDetails.issueId,
                proposalDetails.instanceId,
                proposalDetails.userProfileId,
                proposal)

        // Add issueId
        if (!issueIds.includes(proposalDetails.issueId)) {
          issueIds.push(proposalDetails.issueId)
        }
      }

      // Debug
      console.log(`${fnName}: issueIds: ` + JSON.stringify(issueIds))

      // Update newsArticleIssue records
      await this.newsArticleIssueModel.setBatchProcessedByIds(
              prisma,
              issueIds,
              undefined,
              true)  // batchProcessed

      // Progress debug
      i += 1

      console.log(`${fnName}: completed proposalDetails ${i} of ` +
                  `${results.proposalSets.length}`)
    }
  }

  async saveProposal(
          prisma: any,
          issueId: string,
          instanceId: string,
          userProfileId: string,
          proposalContent: any) {

    // Debug
    const fnName = `${this.clName}.saveProposal()`

    // Skip any badly formed content
    if (proposalContent.name == null ||
        proposalContent.text == null) {
      
      return
    }

    // Skip minimal content
    if (proposalContent.name.toLowerCase() === proposalContent.text.toLowerCase() ||
        proposalContent.text.length < 80) {

      return
    }

    // Get the id if specified, but ignore invalid ids (expects a Prisma string
    // id, which is much longer than 10 chars).
    var proposalId = proposalContent.id

    console.log(`${fnName}: proposalId: ` + JSON.stringify(proposalId))

    if (proposalId != null) {
      if (proposalId.length < 10) {

        proposalId = null
      } else {
        // Try to get the existing record to validate
        const testProposal = await
                this.proposalModel.getById(
                  prisma,
                  proposalId,
                  false)  // includeKbFile

        if (testProposal == null) {
          proposalId = null
        }
      }
    }

    // If this is a new proposal, check if the max generated proposals per
    // issue has been reached. If so, return.
    if (proposalId == null) {

      // Get the existing proposals count for the issue
      const existingProposalsCount = await
              this.proposalModel.countByIssueId(
                prisma,
                issueId)

      // Return if a new proposal would be created and the max generated
      // proposals for this issue has already been reached
      if (existingProposalsCount >= this.maxGeneratedProposalsPerIssue) {
        return
      }
    }

    // Upsert the issue
    const proposalResults = await
            this.proposalService.upsert(
              prisma,
              proposalId,
              undefined,             // kbFileId
              issueId,
              undefined,             // voteSystemId
              undefined,             // votingOpens
              undefined,             // votingCloses
              BaseDataTypes.activeStatus,
              proposalContent.name,
              instanceId,
              userProfileId,
              false)                 // verifyAccess

    if (proposalResults.status === false) {

      throw new CustomError(`${fnName}: proposal upsert failed: ` +
                            JSON.stringify(proposalResults.message)
      )
    }

    if (proposalResults.proposal == null) {

      throw new CustomError(`${fnName}: proposalResults.proposal == null`)
    }

    // Get or create the KbFileContent record
    var kbFileContent = await
          this.kbFileContentModel.getByKbFileId(
            prisma,
            proposalResults.proposal.kbFileId)

    if (kbFileContent != null) {

      // Set the new content
      await this.kbFileContentModel.update(
              prisma,
              kbFileContent.id,
              undefined,  // kbFileId
              proposalContent.text,
              undefined)  // summary
    } else {

      // Create the new content
      kbFileContent = await
        this.kbFileContentModel.create(
          prisma,
          proposalResults.proposal.kbFileId,
          proposalContent.text,
          undefined)      // summary
    }

    // Upsert the tags
    if (proposalContent.tags != null) {

      await this.saveTags(
              prisma,
              instanceId,
              proposalResults.proposal.id,
              proposalContent.tags)
    }
  }

  async saveTags(
          prisma: any,
          instanceId: string,
          proposalId: string,
          tags: string[]) {

    // Get the number of existing tags (if any)
    const existingProposalTags = await
            this.proposalTagModel.filter(
              prisma,
              proposalId,
              undefined,  // proposalTagOptionId
              false)      // orderByName

    var existingProposalTagOptionIds: string[] = []

    for (const existingProposalTag of existingProposalTags) {

      if (!existingProposalTagOptionIds.includes(existingProposalTag.proposalTagOptionId)) {

        existingProposalTagOptionIds.push(existingProposalTag.proposalTagOptionId)
      }
    }

    // Iterate generated tags
    for (const tag of tags) {

      // Break if the max generated tags has been reached
      if (existingProposalTagOptionIds.length >= this.maxGeneratedTags) {
        break
      }

      // Get the ProposalTagOption
      var proposalTagOption = await
            this.proposalTagOptionModel.getByParentIdAndInstanceIdAndName(
              prisma,
              null,  // parentId
              instanceId,
              tag)

      // Not found
      if (proposalTagOption == null) {

        proposalTagOption = await
          this.proposalTagOptionModel.create(
            prisma,
            null,  // parentId
            instanceId,
            tag)
      }

      // Get/create ProposalTag
      const proposalTag = await
              this.proposalTagModel.getByProposalIdAndProposalTagOptionId(
                prisma,
                proposalId,
                proposalTagOption.id)

      if (proposalTag == null) {

        await this.proposalTagModel.create(
                prisma,
                proposalId,
                proposalTagOption.id)

        existingProposalTagOptionIds.push(proposalTagOption.id)
      }
    }
  }
}
