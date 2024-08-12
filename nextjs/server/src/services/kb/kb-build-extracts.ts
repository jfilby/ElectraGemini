import { CustomError } from '@/serene-core-server/types/errors'
import { AgentsService } from '@/serene-ai-server/services/agents/agents-service'
import { ChatService } from '@/serene-ai-server/services/llm-apis/chat-service'
import { LlmUtilsService } from '@/serene-ai-server/services/llm-apis/utils-service'
import { KbFileExtractModel } from '@/models/kb/kb-file-extract-model'
import { BaseDataTypes } from '@/types/base-data-types'
import { InstanceModel } from '@/models/instances/instance-model'
import { KbFileModel } from '@/models/kb/kb-file-model'
import { KbFileContentModel } from '@/models/kb/kb-file-content-model'
import { KbLoadForRagService } from './kb-load-for-rag-service'
import { KbPathService } from './kb-path-service'

export class KbBuildExtractsService {

  // Consts
  clName = 'KbBuildExtractsService'

  // Models
  instanceModel = new InstanceModel()
  kbFileExtractModel = new KbFileExtractModel()
  kbFileModel = new KbFileModel()
  kbFileContentModel = new KbFileContentModel()
  llmUtilsService = new LlmUtilsService()

  // Services
  agentsService = new AgentsService()
  chatService = new ChatService()
  kbLoadForRagService = new KbLoadForRagService()

  // Code
  async buildPromptSnippet(
          prisma: any,
          documents: any[] = []) {

    // Debug
    const fnName = `${this.clName}.buildPromptSnippet()`

    console.log(`${fnName}: documents: ${documents.length}`)

    // Prompt service (has caching)
    const kbPathService = new KbPathService()

    // Var
    var promptSnippet = ''

    // Add documents
    for (const document of documents) {

      // Debug
      console.log(`${fnName}: document: ` +
                  JSON.stringify(document))

      // Skip empty text content
      if (document.kbFileContent.text == null) {
        continue
      }

      // Get path
      const path = await
              kbPathService.getPath(
                prisma,
                document.kbFile.id,
                '',
                true)  // cache

      // Include document
      promptSnippet +=
        `File: ${path?.join('/')}\n`

      promptSnippet +=
        `${BaseDataTypes.textDelimiter}\n` +
        document.kbFileContent.text + '\n' +
        `${BaseDataTypes.textDelimiter}\n` +
        `\n`
    }

    // Debug
    console.log(`${fnName}: promptSnippet: ${promptSnippet}`)

    // Return
    return {
      promptSnippet: promptSnippet
    }
  }

  async buildKbSummary(
          prisma: any,
          instanceId: string) {

    // Build an outline tree
    const outlineTreeResults = await
            this.kbLoadForRagService.buildOutlineTree(
              prisma,
              instanceId,
              false,  // includeContents
              false)  // includeDirectories

    // Return
    return {
      kb: outlineTreeResults.kb
    }
  }

  getPromptForRequestRelevantDocs(kb: any[]) {

    // Debug
    const fnName = `${this.clName}.getPromptForRequestRelevantDocs()`

    // Validate
    if (kb == null) {
      throw new CustomError(`${fnName}: kb == null`)
    }

    if (kb.length === 0) {
      throw new CustomError(`${fnName}: b.length === 0`)
    }

    // Formulate prompt
    var prompt =
          `This is a list of documents in the knowledge base. Please return ` +
          `a list of ids for documents to include when generating issues ` +
          `and proposals. Order from most to least relevant.\n` +
          `\n` +
          `Return the list of ids as a JSON array, e.g.:\n` +
          `[ "123", "456" ]\n` +
          `\n`

    for (const kbFile of kb) {

      prompt += `Id: ${kbFile.kbFileId}  has path: ${kbFile.path}\n`
    }

    // Return
    return prompt
  }

  async isBuildExtractNeeded(
          prisma: any,
          instanceId: string) {

    // Get KbFileExtract record
    const kbFileExtract = await
            this.kbFileExtractModel.getByInstanceIdAndPurpose(
              prisma,
              instanceId,
              BaseDataTypes.issueAndProposalGenerationPurpose)

    if (kbFileExtract == null) {

      // Need to build a first extract
      return {
        buildExtract: true
      }
    }

    // Get latest update to KbFile
    const latestUpdatedKbFile = await
            this.kbFileModel.getLatest(
              prisma,
              instanceId,
              undefined,  // parentId
              null)       // refModel

    if (latestUpdatedKbFile != null &&
        latestUpdatedKbFile.updated > kbFileExtract.update) {

      return {
        buildExtract: true
      }
    }

    // Get latest update to KbFileContent
    const latestUpdatedKbFileContent = await
            this.kbFileContentModel.getLatest(
              prisma,
              instanceId,
              undefined,  // parentId
              null)       // refModel

    if (latestUpdatedKbFileContent != null &&
        latestUpdatedKbFileContent.updated > kbFileExtract.update) {

      return {
        buildExtract: true
      }
    }

    // Return no build needed
    return {
      buildExtract: false
    }
  }

  async llmRequestRelevantDocs(
          prisma: any,
          kb: any[]) {

    // Debug
    const fnName = `${this.clName}.llmRequestRelevantDocs()`

    // Get prompt
    const prompt =
            this.getPromptForRequestRelevantDocs(kb)

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
              true)       // jsonMode

    // Validate
    if (chatCompletionResults.messages == null) {
      throw new CustomError(`${fnName}: no messages`)
    }

    if (chatCompletionResults.json == null) {
      throw new CustomError(`${fnName}: no json`)
    }

    // Get documents
    var documents: any[] = []

    for (const kbFileId of chatCompletionResults.json) {

      // Debug
      console.log(`${fnName}: kbFileId: ` +
                  JSON.stringify(kbFileId))

      // Get the KbFile record
      const kbFile = await
              this.kbFileModel.getById(
                prisma,
                kbFileId)

      // Ignore if not found
      if (kbFile == null) {
        continue
      }

      // Get the content
      const kbFileContent = await
              this.kbFileContentModel.getByKbFileId(
                prisma,
                kbFileId)

      // Ignore if not found
      if (kbFileContent == null) {
        continue
      }

      // Add to documents
      documents.push({
        kbFile: kbFile,
        kbFileContent: kbFileContent
      })
    }

    // Debug
    console.log(`${fnName}: documents: ${documents.length}`)

    // Return
    return {
      documents: documents
    }
  }

  async run(prisma: any) {

    // Get instances
    const instances = await
            this.instanceModel.filter(
              prisma,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined)

    // Run for each instance
    for (const instance of instances) {

      await this.runForInstance(
              prisma,
              instance.id)
    }
  }

  async runForInstance(
          prisma: any,
          instanceId: string) {

    // Debug
    const fnName = `${this.clName}.run()`

    // Has the KB changed since the last run?
    const isBuildExtractNeededResults = await
            this.isBuildExtractNeeded(
              prisma,
              instanceId)

    console.log(`${fnName}: isBuildExtractNeededResults.buildExtract: ` +
                JSON.stringify(isBuildExtractNeededResults.buildExtract))

    if (isBuildExtractNeededResults.buildExtract === false) {

      return {
        status: true
      }
    }

    // Build a summary of the KB
    const kbSummaryResults = await
            this.buildKbSummary(
              prisma,
              instanceId)

    console.log(`${fnName}: kbSummaryResults.kb: ` +
                JSON.stringify(kbSummaryResults.kb))

    // Use the LLM to ask for documents relevant to generating issues and
    // proposals.
    var promptSnippet = ''

    if (kbSummaryResults.kb.length === 0) {

      console.log(
        `${fnName}: no KB files to list, saving an empty prompt snippet..`)
    } else {

      const relevantDocsResults = await
              this.llmRequestRelevantDocs(
                prisma,
                kbSummaryResults.kb)

      // Build a prompt snippet out of the documents
      const promptSnippetResults = await
              this.buildPromptSnippet(
                prisma,
                relevantDocsResults.documents)

      promptSnippet = promptSnippetResults.promptSnippet
    }

    // Save the prompt snippet
    await this.savePromptSnippet(
            prisma,
            instanceId,
            promptSnippet)

    // Return
    return {
      status: true
    }
  }

  async savePromptSnippet(
          prisma: any,
          instanceId: string,
          promptSnippet: string) {

    // Save
    await this.kbFileExtractModel.upsert(
            prisma,
            undefined,  // id
            instanceId,
            BaseDataTypes.issueAndProposalGenerationPurpose,
            promptSnippet)
  }
}
