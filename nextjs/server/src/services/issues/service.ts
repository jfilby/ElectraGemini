import { CustomError } from '@/serene-core-server/types/errors'
import { CachedEmbeddingModel } from '@/serene-ai-server/models/cache/cached-embedding-model'
import { SnippetService } from '@/serene-ai-server/services/content/snippet-service'
import { BaseDataTypes } from '@/types/base-data-types'
import { KbFileTypes } from '@/types/kb-file-types'
import { IssueModel } from '@/models/issues/issue-model'
import { IssueTagModel } from '@/models/issues/issue-tag-model'
import { IssueTagOptionModel } from '@/models/issues/issue-tag-option-model'
import { KbFileContentModel } from '@/models/kb/kb-file-content-model'
import { KbFileModel } from '@/models/kb/kb-file-model'
import { ProposalModel } from '@/models/proposals/proposal-model'
import { InstanceService } from '../instances/service'
import { KbFileService } from '../kb/kb-file-service'
import { KbFileContentService } from '../kb/kb-file-content-service'
import { ProposalService } from '../proposals/service'

export class IssueService {

  // Consts
  clName = 'IssueService'

  refModel = BaseDataTypes.issueModel

  // Models
  cachedEmbeddingModel = new CachedEmbeddingModel()
  issueModel = new IssueModel()
  issueTagModel = new IssueTagModel()
  issueTagOptionModel = new IssueTagOptionModel()
  kbFileContentModel = new KbFileContentModel()
  kbFileModel = new KbFileModel()
  proposalModel = new ProposalModel()

  // Services
  instanceService = new InstanceService()
  kbFileService = new KbFileService()
  kbFileContentService = new KbFileContentService()
  proposalService = new ProposalService()
  snippetService = new SnippetService()

  // Code
  async deleteById(
          prisma: any,
          issueId: string,
          instanceId: string,
          userProfileId: string,
          verifyAccess: boolean) {

    // Verify access
    if (verifyAccess === true &&
        issueId != null) {

      const hasWriteAccess = await
              this.getAccessToWrite(
                prisma,
                instanceId,
                userProfileId)

      if (hasWriteAccess.status === false) {
        return hasWriteAccess
      }
    }

    // Cascading delete
    await this.issueModel.deleteCascadeById(
            prisma,
            issueId,
            instanceId)

    // Return
    return {
      status: true
    }
  }

  async deleteByIds(
          prisma: any,
          issueIds: string[],
          instanceId: string,
          userProfileId: string,
          verifyAccess: boolean) {

    // Debug
    const fnName = `${this.clName}.deleteByIds()`

    // Iterate, checking the access of each file
    for (const issueId of issueIds) {

      const results = await
              this.deleteById(
                prisma,
                issueId,
                instanceId,
                userProfileId,
                verifyAccess)

      if (results.status === false) {
        return results
      }
    }

    // Return
    return {
      status: true
    }
  }

  async deleteByInstanceId(
          prisma: any,
          instanceId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.deleteByInstanceId()`

    // Get the proposals to delete
    const issuesResults = await
            this.issueModel.filter(
              prisma,
              instanceId,
              undefined,  // kbFileId
              undefined,  // tag
              undefined,  // page
              undefined,  // pageSize
              false)      // includeKbFile

    // Delete each one (cascading to KB models)
    for (const issue of issuesResults.issues) {

      await this.issueModel.deleteCascadeById(
              prisma,
              issue.id)
    }

    // Return
    return {
      status: true
    }
  }

  async filter(
          prisma: any,
          status: string,
          tag: string | undefined,
          page: number | undefined,
          instanceId: string,
          userProfileId: string,
          includeTagOptions: boolean,
          includeProposalCount: boolean,
          verifyAccess: boolean) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Verify access
    var hasReadAccess = true

    if (verifyAccess === true) {

      console.log(`${fnName}: verifying read access for instanceId: ` +
                  `${instanceId} and userProfileId: ${userProfileId}`)

      const hasReadAccessResults = await
              this.getAccessToRead(
                prisma,
                instanceId,
                userProfileId)

      if (hasReadAccessResults.status === false) {

        console.log(`${fnName}: access failed: hasReadAccessResults: ` +
                    JSON.stringify(hasReadAccessResults))

        return {
          status: false,
          message: hasReadAccessResults.message,
          found: false
        }
      }

      hasReadAccess = hasReadAccessResults.status
    }

    // Get records
    const issuesResults = await
            this.issueModel.filter(
              prisma,
              instanceId,
              undefined,  // kbFileId
              tag,
              page,
              20,         // pageSize
              true,       // includeKbFile
              true)       // orderByName

    // Debug
    // console.log(`${fnName}: issues: ` + JSON.stringify(issues))
    // console.log(`${fnName}: issues: ${issues.length}`)

    // Get each record to return in detail
    var issuesWithDetails: any[] = []

    for (const issue of issuesResults.issues) {

      const issueResults = await
              this.getById(
                prisma,
                issue.id,
                instanceId,
                userProfileId,
                true,   // includeTags
                includeProposalCount,
                false,  // includeProposals
                false)  // verifyAccess

      // Debug
      // console.log(`${fnName}: issueResults: ` + JSON.stringify(issueResults))

      if (issueResults.found === true) {
        issuesWithDetails.push(issueResults.issue)
      }
    }

    var results: any = {
          status: true,
          issues: issuesWithDetails,
          hasMore: issuesResults.hasMore
        }

    // Include tag options
    if (includeTagOptions === true) {

      const issueTagOptions = await
              this.issueTagOptionModel.filter(
                prisma,
                undefined,  // parentId
                instanceId,
                true)       // orderByName

      var tagOptions: string[] = []

      for (const issueTagOption of issueTagOptions) {

        tagOptions.push(issueTagOption.name)
      }

      results.tagOptions = tagOptions
    }

    // Return
    return results
  }

  async getAccessToRead(
          prisma: any,
          instanceId: string,
          userProfileId: string) {

    return await this.getAccessToWrite(
             prisma,
             instanceId,
             userProfileId)
  }

  async getAccessToWrite(
          prisma: any,
          instanceId: string,
          userProfileId: string) {

    // Debug
    const fnName = `${this.clName}.getAccessToWrite()`

    // Go on the instance access
    const instanceAccessResults = await
            this.instanceService.getAccessToWrite(
              prisma,
              userProfileId,
              undefined,  // instance
              instanceId)

    return instanceAccessResults
  }

  async getById(
          prisma: any,
          id: string,
          instanceId: string,
          userProfileId: string,
          includeTags: boolean,
          includeProposalCount: boolean,
          includeProposals: boolean,
          verifyAccess: boolean) {

    // Debug
    const fnName = `${this.clName}.getById()`

    console.log(`${fnName}: starting with id: ${id}`)
  
    // Include ACL
    const includeAcl = true

    // Initial validation
    if (instanceId == null) {
      throw new CustomError(`${fnName}: instanceId == null`)
    }

    // Get by id
    const issue = await
            this.issueModel.getById(
              prisma,
              id,
              true)  // includeKbFile

    if (issue == null) {

      console.error(`${fnName}: issue == null for id: ${id}`)

      return {
        status: true,
        found: false
      }
    }

    // Verify access
    var hasReadAccess = true

    if (verifyAccess === true &&
        id != null) {

      console.log(`${fnName}: verifying read access for instanceId: ` +
                  `${instanceId} and userProfileId: ${userProfileId}`)

      const hasReadAccessResults = await
              this.getAccessToRead(
                prisma,
                instanceId,
                userProfileId)

      if (hasReadAccessResults.status === false) {

        console.log(`${fnName}: access failed: hasReadAccessResults: ` +
                    JSON.stringify(hasReadAccessResults))

        return {
          status: false,
          message: hasReadAccessResults.message,
          found: false
        }
      }

      hasReadAccess = hasReadAccessResults.status
    }

    // Get KbFile
    const kbFileResults = await
            this.kbFileService.getById(
              prisma,
              issue.kbFileId,
              instanceId,
              userProfileId,
              true,   // includeAcl
              false,  // includeFolderFiles
              false,  // includeFolderBreadcrumbs,
              verifyAccess)

    if (kbFileResults.status === false) {

      const message = `KbFile not found for kbFileId: ` +
                      JSON.stringify(issue.kbFileId)

      console.error(`${fnName}: message: ${message}`)

      return {
        status: false,
        message: message,
        found: false
      }
    }

    if (kbFileResults.found === true) {
      issue.kbFile = kbFileResults.kbFile
    }

    // Get kbFileContent
    const kbFileContentResults = await
            this.kbFileContentService.getByKbFileId(
              prisma,
              issue.kbFileId,
              instanceId,
              userProfileId,
              verifyAccess)

    if (kbFileContentResults.status === false) {

      const message = `Failed to get KbFileContent with id: ` +
                      JSON.stringify(issue.kbFileId)

      console.error(`${fnName}: message: ${message}`)

      return {
        status: false,
        message: message,
        found: false
      }
    }

    issue.kbFileContent = kbFileContentResults.kbFileContent

    // Debug
    // console.log(`${fnName}: kbFileContentResults.kbFileContent: ` +
    //             JSON.stringify(kbFileContentResults.kbFileContent))

    // Get snippet
    issue.kbFile.snippet =
      this.snippetService.getSnippet(kbFileContentResults.kbFileContent.text)

    // includeAcl
    if (includeAcl === true) {

      const hasWriteAccessResults = await
              this.getAccessToWrite(
                prisma,
                instanceId,
                userProfileId)

      issue.acl = {
        read: hasReadAccess,
        write: hasWriteAccessResults.status
      }
    }

    // Get tags
    if (includeTags === true) {

      const tags = await
              this.getIssueTags(
                prisma,
                id)

      issue.tags = tags
    }

    // Get proposal count
    if (includeProposalCount === true) {

      const proposalCount = await
              this.proposalModel.countByIssueId(
                prisma,
                issue.id)

      // console.log(`${fnName}: proposalCount: ` + JSON.stringify(proposalCount))

      issue.proposalCount = proposalCount
    }

    // Get proposals
    if (includeProposals === true) {

      const proposalResults = await
              this.proposalService.filter(
                prisma,
                id,
                BaseDataTypes.activeStatus,
                undefined,  // tag
                undefined,  // page
                instanceId,
                userProfileId,
                true,       // includeTagOptions
                true,       // includeIssues
                false)      // verifyAccess

      issue.proposals = proposalResults.proposals
    }

    // Return
    // console.log(`${fnName}: returning..`)
    // console.log(`${fnName}: issue: ` + JSON.stringify(issue))

    return {
      status: true,
      found: true,
      issue: issue
    }
  }

  async getIssueTags(
          prisma: any,
          issueId: string) {

    // Get IssueTags
    const issueTags = await
            this.issueTagModel.filter(
              prisma,
              issueId,
              undefined,  // issueTagOptionId
              true)       // orderByName

    var tags: any[] = []

    // Add IssueTagOptions
    for (var issueTag of issueTags) {

      // Get IssueTagOption
      const issueTagOption = await
              this.issueTagOptionModel.getById(
                prisma,
                issueTag.issueTagOptionId)

      issueTag.issueTagOption = issueTagOption

      if (issueTagOption != null) {
        tags.push(issueTag)
      }
    }

    // Return
    return tags
  }

  async search(
          prisma: any,
          status: string,
          input: string,
          page: number,
          instanceId: string,
          userProfileId: string,
          includeProposalCount: boolean,
          verifyAccess: boolean) {

    // Debug
    const fnName = `${this.clName}.search()`

    // Verify access
    if (verifyAccess === true) {

      const hasReadAccess = await
              this.instanceService.getAccessToRead(
                prisma,
                userProfileId,
                undefined,  // instance
                instanceId)

      if (hasReadAccess.status === false) {
        return {
          status: false,
          message: hasReadAccess.message,
          kbFile: undefined
        }
      }
    }

    // Get or generate an embedding
    var inputEmbedding: any
    input = input.trim()

    const cachedEmbedding = await
            this.cachedEmbeddingModel.getByText(
              prisma,
              input)

    if (cachedEmbedding != null) {

      inputEmbedding = cachedEmbedding.embedding
    } else {
      // Generate an embedding
      const inputEmbeddingResults = await
              this.kbFileService.generateTextEmbedding(input)

      if (inputEmbeddingResults.status === false) {
        return inputEmbeddingResults
      }

      inputEmbedding = inputEmbeddingResults.embedding.values

      // Save the embedding
      await this.cachedEmbeddingModel.create(
              prisma,
              input,
              inputEmbedding)
    }

    // Get records
    const kbResultsFiles = await
            this.kbFileModel.searchEmbeddings(
              prisma,
              instanceId,
              status,
              inputEmbedding,
              BaseDataTypes.issueModel,  // refModel
              page,
              KbFileTypes.searchPageSize)

    // Debug
    // console.log(`${fnName}: kbResultsFiles: ` + JSON.stringify(kbResultsFiles))
    console.log(`${fnName}: kbFiles: ${kbResultsFiles.kbFiles.length}`)

    // Get KbFileContent and Issue records
    var issues: any[] = []

    for (const kbResultsFile of kbResultsFiles.kbFiles) {

      // Get KbFile
      const kbFile = await
              this.kbFileModel.getById(
                prisma,
                kbResultsFile.id,
                true)  // includeKbFileContent

      // Skip kbFiles without content
      if (kbFile.kbFileContent == null) {

        console.warn(`${fnName}: skipping result with null content`)
        continue
      }

      // Get Issue by kbFileId
      const issue = await
              this.issueModel.getByKbFileId(
                prisma,
                kbFile.id)

      // Get Issue with details
      const issueResults = await
              this.getById(
                prisma,
                issue.id,
                instanceId,
                userProfileId,
                true,   // includeTags
                includeProposalCount,
                false,  // includeProposals
                false)  // verifyAccess

      // Add to results
      issues.push(issueResults.issue)
    }

    // Return
    return {
      status: true,
      issues: issues,
      hasMore: kbResultsFiles.hasMore
    }
  }

  async upsert(
          prisma: any,
          issueId: string | undefined,
          parentId: string | undefined,
          kbFileId: string | undefined,
          status: string,
          name: string,
          instanceId: string,
          userProfileId: string,
          verifyAccess: boolean) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting with issueId: ${issueId} ` +
                `instanceId: ${instanceId} name: ${name}`)

    // If issueId isn't specified, try to get by unique key on KbFile
    if (issueId == null &&
        instanceId != null &&
        name != null) {

      console.log(`${fnName}: checking for existing issue by unique key`)

      const kbFile = await
              this.kbFileModel.getByParentIdAndInstanceIdAndName(
                prisma,
                null,  // parentId,
                instanceId,
                name,
                this.refModel)

      if (kbFile != null) {

        const issue = await
                this.issueModel.getByKbFileId(
                  prisma,
                  kbFile.id)

        if (issue != null) {
          issueId = issue.id
          kbFileId = issue.kbFileId
        }
      }
    }

    console.log(`${fnName}: after unique key get, issueId: ${issueId} `)

    // Verify access
    if (verifyAccess === true &&
        issueId != null) {

      const hasWriteAccess = await
              this.getAccessToWrite(
                prisma,
                instanceId,
                userProfileId)

      if (hasWriteAccess.status === false) {
        return {
          status: false,
          message: hasWriteAccess.message,
          issue: undefined
        }
      }
    }

    // If creating an issue, then create a KbFile record
    if (issueId == null) {

      const kbFile = await
              this.kbFileModel.create(
                prisma,
                null,       // parentId
                instanceId,
                userProfileId,
                undefined,  // assignedToId
                undefined,  // taskId
                undefined,  // publicAccess
                BaseDataTypes.issueModel,    // refModel
                BaseDataTypes.activeStatus,
                KbFileTypes.markdownFormat,
                name,
                [],         // tags
                false)      // refreshEmbedding

      kbFileId = kbFile.id
    }

    // Upsert Issue record
    const issue = await
            this.issueModel.upsert(
              prisma,
              issueId,
              parentId,
              instanceId,
              kbFileId)

    // Return
    return {
      status: true,
      issue: issue
    }
  }
}
