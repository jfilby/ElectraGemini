import { CustomError } from '@/serene-core-server/types/errors'
import { AiTechDefs } from '@/serene-ai-server/types/tech-defs'
import { AgentsService } from '@/serene-ai-server/services/agents/agents-service'
import { ChatService } from '@/serene-ai-server/services/llm-apis/chat-service'
import { LlmUtilsService } from '@/serene-ai-server/services/llm-apis/utils-service'
import { ChatSessionService } from '@/serene-ai-server/services/chats/sessions/chat-session-service'
import { BaseDataTypes } from '@/types/base-data-types'
import { InstanceModel } from '@/models/instances/instance-model'
import { IssueModel } from '@/models/issues/issue-model'
import { IssueTagModel } from '@/models/issues/issue-tag-model'
import { IssueTagOptionModel } from '@/models/issues/issue-tag-option-model'
import { KbFileContentModel } from '@/models/kb/kb-file-content-model'
import { KbFileExtractModel } from '@/models/kb/kb-file-extract-model'
import { NewsArticleInstanceModel } from '@/models/news-articles/news-article-instance-model'
import { NewsArticleIssueModel } from '@/models/news-articles/news-article-issue-model'
import { NewsArticleModel } from '@/models/news-articles/news-article-model'
import { InstanceService } from '../instances/service'
import { IssueService } from '../issues/service'

export class GenerateIssuesService {

  // Consts
  clName = 'GenerateIssuesService'

  // Settings
  maxGeneratedTags = Number(process.env.NEXT_PUBLIC_MAX_GENERATED_TAGS)

  // Models
  instanceModel = new InstanceModel()
  issueModel = new IssueModel()
  issueTagModel = new IssueTagModel()
  issueTagOptionModel = new IssueTagOptionModel()
  kbFileContentModel = new KbFileContentModel()
  kbFileExtractModel = new KbFileExtractModel()
  newsArticleInstanceModel = new NewsArticleInstanceModel()
  newsArticleIssueModel = new NewsArticleIssueModel()
  newsArticleModel = new NewsArticleModel()

  // Services
  agentsService = new AgentsService()
  chatService = new ChatService()
  chatSessionService = new ChatSessionService()
  instanceService = new InstanceService()
  issueService = new IssueService()
  llmUtilsService = new LlmUtilsService()

  // Code
  async createMissingNewsArticleInstances(
          prisma: any,
          instanceId: string) {

    // Get NewsArticle records without NewsArticleInstance records
    const newsArticles = await
            this.newsArticleModel.getWithoutNewsArticleInstance(
              prisma,
              instanceId)

    // Create missing records
    for (const newsArticle of newsArticles) {

      const newsArticleInstance = await
              this.newsArticleInstanceModel.create(
                prisma,
                instanceId,
                newsArticle.id,
                false)  // batchProcessed
    }
  }

  async generate(
          prisma: any,
          instance: any) {

    // Debug
    const fnName = `${this.clName}.generate()`

    console.log(`${fnName}: starting..`)

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

    // console.log(`${fnName}: tech: ${JSON.stringify(tech)}`)

    // Generate issues
    const generatedResults = await
            this.generateForInstance(
              prisma,
              tech,
              agent,
              instance)

    // Return
    return generatedResults
  }

  async generateForInstance(
          prisma: any,
          tech: any,
          agent: any,
          instance: any) {

    // Debug
    const fnName = `${this.clName}.generateForInstance()`

    console.log(`${fnName}: starting with: instanceId: ${instance.id}`)

    if (instance.legalGeo.country2LetterCode == null) {
      throw new CustomError(
                  `${fnName}: instance.legalGeo.country2LetterCode == null ` +
                  `instance: ` + JSON.stringify(instance))
    }

    // The number of news articles to process at a time, based on the context
    // window size of the LLM in use. Default to a large context window size.
    var newsArticlesLimitBy = 20

    if (AiTechDefs.variantToMaxInputTokens[tech.variantName] <
        AiTechDefs.largeContextTokenSize) {

      newsArticlesLimitBy = 5
    }

    /* Get issue tag options for the instance
    const issueTagOptions = await
            this.issueTagOptionModel.filter(
              prisma,
              undefined,  // parentId
              instance.id,
              true)       // orderByName */

    // Listing existing tags not found useful in testing, and uses up a lot of
    // the LLM context window.
    const issueTagOptions: any[] = []

    // Get a batch of news articles to process
    const newsArticlesInstance = await
            this.newsArticleInstanceModel.getByInstanceIdAndBatchProcessed(
              prisma,
              instance.id,
              false,  // batchProcessed
              false,  // includeNewsArticles
              newsArticlesLimitBy)

    var newsArticleIds: string[] = []

    for (const newsArticleInstance of newsArticlesInstance) {
      newsArticleIds.push(newsArticleInstance.newsArticleId)
    }

    const newsArticles = await
            this.newsArticleModel.getByIds(
              prisma,
              newsArticleIds)

    // Don't proceed if no news articles are available (exit loop)
    if (newsArticles.length === 0) {
      return {
        newsArticles: [],
        issues: []
      }
    }

    // Get existing issues for the instance
    const existingIssuesResults = await
            this.issueService.filter(
              prisma,
              BaseDataTypes.activeStatus,
              undefined,  // tag
              undefined,  // page
              instance.id,
              agent.userProfileId,
              false,      // includeTagOptions
              false,      // includeProposalCount
              false)      // verifyAccess

    // Generate issues from news articles/headlines
    const issuesResults = await
            this.generateIssues(
              prisma,
              tech,
              agent,
              instance.id,
              instance.legalGeo.country2LetterCode,
              issueTagOptions,
              newsArticles,
              existingIssuesResults.issues)

    // Return
    return {
      newsArticles: newsArticles,
      issues: issuesResults.issues
    }
  }

  async generateIssues(
          prisma: any,
          tech: any,
          agent: any,
          instanceId: string,
          country2LetterCode: string,
          issueTagOptions: any[],
          newsArticles: any[],
          existingIssues: any[]) {

    // Debug
    const fnName = `${this.clName}.generateIssues()`

    // console.log(`${fnName}: starting with newsArticles: ` +
    //             JSON.stringify(newsArticles) +
    //             ` existingIssues: ` + JSON.stringify(existingIssues))

    // Formulate the prompt
    const prompt = await
            this.getGenerateIssuesPrompt(
              prisma,
              instanceId,
              tech,
              country2LetterCode,
              issueTagOptions,
              newsArticles,
              existingIssues)

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
      issues: chatCompletionResults.json.issues
    }
  }

  async getGenerateIssuesPrompt(
          prisma: any,
          instanceId: string,
          tech: any,
          country2LetterCode: string,
          issueTagOptions: any[],
          newsArticles: any[],
          existingIssues: any[]) {

    // Debug
    const fnName = `${this.clName}.getGenerateIssuesPrompt()`

    console.log(`${fnName}: starting..`)

    // Initial role with instructions
    var prompt =
          `Your role is a political analyst. You need to identify the main ` +
          `issues you find by reading the latest headlines. Be specific ` +
          `when naming issues, but reuse existing issues where possible, ` +
          `just update the content.\n` +
          `You need to analyze and write from the perspective of the ` +
          `country with code: ${country2LetterCode}\n`

    // Add issue tags
    prompt +=
      `The issues of interest are categorized by tags, you should list the ` +
      `relevant tags per issue. Try not to create tags that are only ` +
      `slightly different and look like duplicates.\n`

    /* if (issueTagOptions.length > 0) {

      prompt += `The existing tags are:\n`

      for (const issueTagOption of issueTagOptions) {

        prompt += `- ${issueTagOption.name}\n`
      }
    } */

    // Add news articles
    prompt += `Here are a list of recent new articles:\n`

    for (const newsArticle of newsArticles) {

      prompt += `Title: ${newsArticle.title}\n`
    }

    // Expected format
    // The (not Javascript) snippet is to avoid some models trying to
    // instantiate a string, breaking the JSON format.
    prompt +=
      `Return the results in JSON format (not Javascript) without comments. ` +
      `Here's an example:\n` +
      `{\n` +
      `  issues: [\n` +
      `    {\n` +
      `      id: "clyijdgj8000449gmrsej1e9u",\n` +
      `      name: "Climate change",\n` +
      `      text: "An important topic today is climate change..",\n` +
      `      tags: ["climate change"]\n` +
      `    }\n` +
      `  ]\n` +
      `}\n` +
      `\n` +
      `Note that:\n` +
      `- The id for updating answers should only be specified if taken from ` +
      `  an existing issue to be merged with. This is a CUID that you should ` +
      `  only obtain from the list of existing issues given.\n` +
      `- If no id is specified then the value should be null.\n` +
      `- You should write extensive text for each answer, of at least one ` +
      `  paragraph, preferably more.\n` +
      `\n`

    // Get the prompt snippet from relevant KB docs
    const kbFileExtract = await
            this.kbFileExtractModel.getByInstanceIdAndPurpose(
              prisma,
              instanceId,
              BaseDataTypes.issueAndProposalGenerationPurpose)

    if (kbFileExtract != null) {

      prompt += kbFileExtract.text + `\n`
    }

    // Issues that already exist
    if (existingIssues.length > 0) {

      prompt +=
        `Here are a list of existing issues. Try to use an existing issue ` +
        `instead of creating a new one, then update its content.\n`
    }

    for (const existingIssue of existingIssues) {

      prompt += `Issue with id: ${existingIssue.id} and name: ` +
                `${existingIssue.kbFile.name}.\n`

      // Only include content if using a model that supports large input tokens
      if (AiTechDefs.variantToMaxInputTokens[tech.variantName] >=
          AiTechDefs.largeContextTokenSize &&
          existingIssue.kbFileContent != null) {
        if (existingIssue.kbFileContent.text != null) {

          prompt +=
            `The content: ${BaseDataTypes.textDelimiter}\n` +
            `${existingIssue.kbFileContent.text}\n` +
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
          instance: any,
          results: any) {

    // Var to build a list of all news articles processed
    var newsArticleIds: string[] = []
    var savedIssues: any[] = []

    // Save each issue
    for (const issue of results.issues) {

      const issueResults = await
              this.saveIssue(
                prisma,
                instance.id,
                instance.createdById,
                instance.country2LetterCode,
                issue)

      // Continue if no issue saved (e.g. due to invalid/insufficient content)
      if (issueResults == null) {
        continue
      }

      // Get news article ids
      for (const newsArticle of results.newsArticles) {

        await this.saveIssueNewsArticle(
                prisma,
                instance.id,
                issueResults.issue.id,
                newsArticle.id)

        if (!newsArticleIds.includes(newsArticle.id)) {

          newsArticleIds.push(newsArticle.id)
        }
      }

      // Add to savedIssues
      savedIssues.push(issueResults.issue)
    }

    // Indicate that news articles have been processed
    await this.updateNewsArticlesToBatchProcessed(
            prisma,
            instance.id,
            savedIssues,
            newsArticleIds)
  }

  async saveIssue(
          prisma: any,
          instanceId: string,
          userProfileId: string,
          country2LetterCode: string,
          issueContent: any) {

    // Debug
    const fnName = `${this.clName}.saveIssue()`

    // Validate
    if (instanceId == null) {
      throw new CustomError(`${fnName}: instanceId == null`)
    }

    if (userProfileId == null) {
      throw new CustomError(`${fnName}: userProfileId == null`)
    }

    // Skip any badly formed content
    if (issueContent.name == null ||
        issueContent.text == null) {

      return undefined
    }

    // Skip minimal content
    if (issueContent.name.toLowerCase() === issueContent.text.toLowerCase() ||
        issueContent.text.length < 80) {

      return undefined
    }

    // Get the id if specified, but ignore invalid ids (expects a Prisma string
    // id, which is much longer than 10 chars).
    var issueId = issueContent.id

    if (issueId != null) {
      if (issueId.length < 10) {

        issueId = null
      } else {
        // Try to get the existing record to validate
        const testIssue = await
                this.issueModel.getById(
                  prisma,
                  issueId,
                  false)  // includeKbFile

        if (testIssue == null) {
          issueId = null
        }
      }
    }

    // Upsert the issue
    const issueResults = await
            this.issueService.upsert(
              prisma,
              issueId,
              undefined,             // parentId
              undefined,             // kbFileId
              BaseDataTypes.activeStatus,
              issueContent.name,
              instanceId,
              userProfileId,
              false)                 // verifyAccess

    // Get or create the KbFileContent record
    var kbFileContent = await
          this.kbFileContentModel.getByKbFileId(
            prisma,
            issueResults.issue.kbFileId)

    if (kbFileContent != null) {

      // Set the new content
      await this.kbFileContentModel.update(
              prisma,
              kbFileContent.id,
              undefined,  // kbFileId
              issueContent.text,
              undefined)  // summary
    } else {

      // Create the new content
      kbFileContent = await
        this.kbFileContentModel.create(
          prisma,
          issueResults.issue.kbFileId,
          issueContent.text,
          undefined)      // summary
    }

    // Save generated tags
    if (issueContent.tags != null) {

      await this.saveTags(
              prisma,
              instanceId,
              issueResults.issue.id,
              issueContent.tags)
    }

    // Return
    return issueResults
  }

  async saveIssueNewsArticle(
          prisma: any,
          instanceId: string,
          issueId: string,
          newsArticleId: string) {

    // Upsert newsArticleIssue
    const newsArticleIssue = await
            this.newsArticleIssueModel.upsert(
              prisma,
              undefined,  // id
              instanceId,
              issueId,
              newsArticleId,
              false)      // batchProcessed
  }

  async saveTags(
          prisma: any,
          instanceId: string,
          issueId: string,
          tags: string[]) {

    // Get the number of existing tags (if any)
    const existingIssueTags = await
            this.issueTagModel.filter(
              prisma,
              issueId,
              undefined,  // issueTagOptionId
              false)      // orderByName

    var existingIssueTagOptionIds: string[] = []

    for (const existingIssueTag of existingIssueTags) {

      if (!existingIssueTagOptionIds.includes(existingIssueTag.issueTagOptionId)) {

        existingIssueTagOptionIds.push(existingIssueTag.issueTagOptionId)
      }
    }

    // Iterate generated tags
    for (const tag of tags) {

      // Break if the max generated tags has been reached
      if (existingIssueTagOptionIds.length >= this.maxGeneratedTags) {
        break
      }

      // Get the IssueTagOption
      var issueTagOption = await
            this.issueTagOptionModel.getByParentIdAndInstanceIdAndName(
              prisma,
              null,  // parentId
              instanceId,
              tag)

      // Not found
      if (issueTagOption == null) {

        issueTagOption = await
          this.issueTagOptionModel.create(
            prisma,
            null,  // parentId
            instanceId,
            tag)
      }

      // Get/create IssueTag
      const issueTag = await
              this.issueTagModel.getByIssueIdAndIssueTagOptionId(
                prisma,
                issueId,
                issueTagOption.id)

      if (issueTag == null) {

        await this.issueTagModel.create(
                prisma,
                issueId,
                issueTagOption.id)

        existingIssueTagOptionIds.push(issueTagOption.id)
      }
    }
  }

  async updateNewsArticlesToBatchProcessed(
          prisma: any,
          instanceId: string,
          issues: any,
          newsArticleIds: string[]) {

    // Debug
    const fnName = `${this.clName}.updateNewsArticlesToBatchProcessed()`

    // Debug
    // console.log(`${fnName}: newsArticleIds: ` + JSON.stringify(newsArticleIds))

    // Update batchProcessed to true
    if (newsArticleIds.length > 0) {

      // Note: don't update NewsArticleIssue record's batchProcessed to true,
      // the proposals generation batch will do that.

      // Update NewsArticleInstance's batchProcessed
      await this.newsArticleInstanceModel.setBatchProcessedByIds(
              prisma,
              instanceId,
              newsArticleIds,
              true)  // batchProcessed
    }
  }
}
