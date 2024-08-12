import { CustomError } from '@/serene-core-server/types/errors'
import { CachedEmbeddingModel } from '@/serene-ai-server/models/cache/cached-embedding-model'
import { SnippetService } from '@/serene-ai-server/services/content/snippet-service'
import { BaseDataTypes } from '@/types/base-data-types'
import { KbFileTypes } from '@/types/kb-file-types'
import { IssueModel } from '@/models/issues/issue-model'
import { ProposalModel } from '@/models/proposals/proposal-model'
import { ProposalTagModel } from '@/models/proposals/proposal-tag-model'
import { ProposalTagOptionModel } from '@/models/proposals/proposal-tag-option-model'
import { KbFileModel } from '@/models/kb/kb-file-model'
import { VoteObjectModel } from '@/models/voting/vote-object-model'
import { GenericModelsService } from '../generic/service'
import { InstanceService } from '../instances/service'
import { KbFileService } from '../kb/kb-file-service'
import { KbFileContentService } from '../kb/kb-file-content-service'

export class ProposalService {

  // Consts
  clName = 'ProposalService'

  refModel = BaseDataTypes.proposalModel

  // Models
  issueModel = new IssueModel()
  kbFileModel = new KbFileModel()
  proposalModel = new ProposalModel()
  proposalTagModel = new ProposalTagModel()
  proposalTagOptionModel = new ProposalTagOptionModel()
  voteObjectModel = new VoteObjectModel()

  // Services
  cachedEmbeddingModel = new CachedEmbeddingModel()
  genericModelsService = new GenericModelsService()
  instanceService = new InstanceService()
  kbFileService = new KbFileService()
  kbFileContentService = new KbFileContentService()
  snippetService = new SnippetService()

  // Code
  async deleteById(
          prisma: any,
          proposalId: string,
          instanceId: string,
          userProfileId: string,
          verifyAccess: boolean) {

    // Verify access
    if (verifyAccess === true &&
        proposalId != null) {

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
    await this.proposalModel.deleteCascadeById(
            prisma,
            proposalId,
            instanceId)

    // Return
    return {
      status: true
    }
  }

  async deleteByIds(
          prisma: any,
          proposalIds: string[],
          instanceId: string,
          userProfileId: string,
          verifyAccess: boolean) {

    // Debug
    const fnName = `${this.clName}.deleteByIds()`

    // Iterate, checking the access of each file
    for (const proposalId of proposalIds) {

      const results = await
              this.deleteById(
                prisma,
                proposalId,
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
    const proposalsResults = await
            this.proposalModel.filter(
              prisma,
              instanceId,
              undefined,  // kbFileId
              undefined,  // tag
              undefined,  // page
              undefined,  // pageSize
              undefined,  // issueId
              false)      // includeKbFile

    // Delete each one (cascading to KB models)
    for (const proposal of proposalsResults.proposals) {

      await this.proposalModel.deleteCascadeById(
              prisma,
              proposal.id)
    }

    // Return
    return {
      status: true
    }
  }

  async filter(
          prisma: any,
          issueId: string,
          status: string,
          tag: string | undefined,
          page: number | undefined,
          instanceId: string,
          userProfileId: string,
          includeTags: boolean,
          includeIssues: boolean,
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
    const proposalsResults = await
            this.proposalModel.filter(
              prisma,
              instanceId,
              undefined,  // kbFileId
              tag,
              page,
              20,         // pageSize
              issueId,
              false,      // includeKbFile
              true)       // orderByName

    // Get each record to return in detail
    var proposalsWithDetails: any[] = []

    for (const proposal of proposalsResults.proposals) {

      const proposalResults = await
              this.getById(
                prisma,
                proposal.id,
                instanceId,
                userProfileId,
                includeTags,
                includeIssues,
                false)  // verifyAccess

      if (proposalResults.found === true) {
        proposalsWithDetails.push(proposalResults.proposal)
      }
    }

    // Return
    return {
      status: true,
      proposals: proposalsWithDetails,
      hasMore: proposalsResults.hasMore
    }
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
          includeIssues: boolean,
          verifyAccess: boolean) {

    // Note: don't try to get the related issue here, that would lead to a
    // circular dependency. Do that in the GraphQL query instead.

    // Debug
    const fnName = `${this.clName}.getById()`

    // Include ACL
    const includeAcl = true

    // Initial validation
    if (instanceId == null) {
      throw new CustomError(`${fnName}: instanceId == null`)
    }

    // Get by id
    const proposal = await
            this.proposalModel.getById(
              prisma,
              id,
              true,  // includeKbFile
              true)  // includeIssue

    if (proposal == null) {
      return {
        status: true,
        found: false
      }
    }

    // Count votes
    const voteObjectVotes = await
            this.voteObjectModel.countVotesByRefId(
              prisma,
              BaseDataTypes.proposalModel,
              proposal.id)

    if (voteObjectVotes != null) {
      proposal.votes = voteObjectVotes._count.ofVotes
    } else {
      proposal.votes = 0
    }

    // Verify access
    var hasReadAccess = true

    if (verifyAccess === true &&
        id != null) {

      // console.log(`${fnName}: verifying read access..`)

      const hasReadAccessResults = await
              this.getAccessToRead(
                prisma,
                instanceId,
                userProfileId)

      if (hasReadAccessResults.status === false) {
        return {
          status: false,
          message: hasReadAccessResults.message,
          found: false
        }
      }

      hasReadAccess = hasReadAccessResults.status
    }

    // Get KbFile and content
    const kbFileResults = await
            this.kbFileService.getById(
              prisma,
              proposal.kbFileId,
              instanceId,
              userProfileId,
              true,   // includeAcl
              false,  // includeFolderFiles
              false,  // includeFolderBreadcrumbs,
              verifyAccess)

    if (kbFileResults.status === false) {
      return {
        status: false,
        found: false
      }
    }

    if (kbFileResults.found === true) {
      proposal.kbFile = kbFileResults.kbFile
    }

    // Get kbFileContent
    const kbFileContentResults = await
            this.kbFileContentService.getByKbFileId(
              prisma,
              proposal.kbFileId,
              instanceId,
              userProfileId,
              false)  // verifyAccess

    if (kbFileContentResults.status === false) {
      return {
        status: false,
        found: false
      }
    }

    proposal.kbFileContent = kbFileContentResults.kbFileContent

    // Get snippet
    proposal.kbFile.snippet =
      this.snippetService.getSnippet(kbFileContentResults.kbFileContent.text)

    // includeAcl
    if (includeAcl === true) {

      const hasWriteAccessResults = await
              this.getAccessToWrite(
                prisma,
                instanceId,
                userProfileId)

                proposal.acl = {
        read: hasReadAccess,
        write: hasWriteAccessResults.status
      }
    }

    // Get tags
    if (includeTags === true) {

      const tags = await
              this.getProposalTags(
                prisma,
                id)

      proposal.tags = tags
    }

    // Return
    // console.log(`${fnName}: returning..`)

    return {
      status: true,
      found: true,
      proposal: proposal
    }
  }

  async getProposalTags(
          prisma: any,
          proposalId: string) {

    // Get ProposalTags
    const proposalTags = await
            this.proposalTagModel.filter(
              prisma,
              proposalId,
              undefined,  // proposalTagOptionId
              true)       // orderByName

    var tags: any[] = []

    // Add ProposalTagOptions
    for (var proposalTag of proposalTags) {

      // Get ProposalTagOption
      const proposalTagOption = await
              this.proposalTagOptionModel.getById(
                prisma,
                proposalTag.proposalTagOptionId)

      proposalTag.proposalTagOption = proposalTagOption

      if (proposalTagOption != null) {
        tags.push(proposalTag)
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
              BaseDataTypes.proposalModel,  // refModel
              page,
              KbFileTypes.searchPageSize)

    // Debug
    // console.log(`${fnName}: kbResultsFiles: ` + JSON.stringify(kbResultsFiles))
    console.log(`${fnName}: kbFiles: ${kbResultsFiles.kbFiles.length}`)

    // Get KbFileContent and Proposal records
    var proposals: any[] = []

    for (const kbResultsFile of kbResultsFiles.kbFiles) {

      // Get KbFile
      const kbFile = await
              this.kbFileModel.getById(
                prisma,
                kbResultsFile.id,
                true)  // includeKbFileContent

      // Debug
      // console.log(`${fnName}: kbFile: ` + JSON.stringify(kbFile))

      // Skip kbFiles without content
      if (kbFile.kbFileContent == null) {

        console.warn(`${fnName}: skipping result with null content`)
        continue
      }

      // Get Proposal by kbFileId
      const proposal = await
              this.proposalModel.getByKbFileId(
                prisma,
                kbFile.id)

      // Debug
      // console.log(`${fnName}: proposal: ` + JSON.stringify(proposal))

      // Get Proposal with details
      const proposalResults = await
              this.getById(
                prisma,
                proposal.id,
                instanceId,
                userProfileId,
                true,   // includeTags
                false,  // includeIssues
                false)  // verifyAccess

      // Add to results
      proposals.push(proposalResults.proposal)
    }

    // Return
    return {
      status: true,
      proposals: proposals,
      hasMore: kbResultsFiles.hasMore
    }
  }

  async upsert(
          prisma: any,
          proposalId: string,
          kbFileId: string | undefined,
          issueId: string,
          voteSystemId: string | undefined,
          votingOpens: Date | undefined,
          votingCloses: Date | undefined,
          status: string,
          name: string,
          instanceId: string,
          userProfileId: string,
          verifyAccess: boolean) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // If proposalId isn't specified, try to get by unique key (for refModel)
    if (proposalId == null &&
        instanceId != null &&
        issueId != null &&
        name != null) {

      const kbFile = await
              this.kbFileModel.getByParentIdAndInstanceIdAndName(
                prisma,
                null,  // parentId,
                instanceId,
                name,
                this.refModel)

      if (kbFile != null) {

        const proposal = await
                this.proposalModel.getByKbFileId(
                  prisma,
                  kbFile.id)

        if (proposal.issueId === issueId) {
          proposalId = proposal.id
          kbFileId = proposal.kbFileId
        }
      }
    }

    // Verify access
    if (verifyAccess === true &&
        proposalId != null) {

      const hasWriteAccess = await
              this.getAccessToWrite(
                prisma,
                instanceId,
                userProfileId)

      if (hasWriteAccess.status === false) {
        return {
          status: false,
          message: hasWriteAccess.message,
          proposal: undefined
        }
      }
    }

    // If creating an issue then:
    // 1. Create a KbFile record
    // 2. Get the default vote system
    if (proposalId == null) {

      // Get the kbFileId of the issue as the parentId, to make the KbFile for
      // the proposal unique.
      if (issueId == null) {
        throw new CustomError(`${fnName}: issueId == null`)
      }

      const issue = await
              this.issueModel.getById(
                prisma,
                issueId,
                false)  // includeKbFile

      const issueKbFile = await
              this.kbFileModel.getById(
                prisma,
                issue.kbFileId)

      // Debug
      console.log(`${fnName}: upserting KbFile record with parentId: ` +
                  `${issueKbFile.id} name: ` + JSON.stringify(name))

      // Upsert KbFile record
      const kbFile = await
              this.kbFileModel.upsert(
                prisma,
                undefined,                    // id
                issueKbFile.id,               // parentId
                instanceId,
                userProfileId,
                undefined,                    // assignedToId
                undefined,                    // taskId
                undefined,                    // publicAccess
                BaseDataTypes.proposalModel,  // refModel
                BaseDataTypes.activeStatus,
                KbFileTypes.markdownFormat,
                name,
                [],                           // tags
                false)                        // refreshEmbedding

      if (kbFile == null) {
        return {
          status: false,
          message: `Failed to create KB entry`
        }
      }

      kbFileId = kbFile.id
    }

    // Upsert record
    const proposal = await
            this.proposalModel.upsert(
              prisma,
              proposalId,
              instanceId,
              kbFileId,
              issueId)

    // Add features
    await this.genericModelsService.addFeatures(
            prisma,
            instanceId,
            this.refModel,
            proposal.id)

    // Debug
    // console.log(`${fnName}: returning with proposal: ` +
    //             JSON.stringify(proposal))

    // Return
    return {
      status: true,
      proposal: proposal
    }
  }
}
