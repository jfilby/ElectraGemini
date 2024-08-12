import { CustomError } from '@/serene-core-server/types/errors'
import { BaseDataTypes } from '@/types/base-data-types'
import { BatchJobModel } from '@/models/batch/batch-job-model'
import { InstanceChatSessionModel } from '@/models/chats/instance-chat-session-model'
import { InstanceModel } from '@/models/instances/instance-model'
import { InstanceSettingModel } from '@/models/instances/instance-setting-model'
import { IssueModel } from '@/models/issues/issue-model'
import { IssueTagOptionModel } from '@/models/issues/issue-tag-option-model'
import { KbFileExtractModel } from '@/models/kb/kb-file-extract-model'
import { KbFileModel } from '@/models/kb/kb-file-model'
import { LegalGeoModel } from '@/models/legal-geos/legal-geo-model'
import { LegalGeoTypeModel } from '@/models/legal-geos/legal-geo-type-model'
import { NewsArticleInstanceModel } from '@/models/news-articles/news-article-instance-model'
import { NewsArticleQueryModel } from '@/models/news-articles/news-article-query-model'
import { ProposalModel } from '@/models/proposals/proposal-model'
import { ProposalPublishedModel } from '@/models/proposals/proposal-published-model'
import { ProposalTagOptionModel } from '@/models/proposals/proposal-tag-option-model'
import { VoteObjectModel } from '@/models/voting/vote-object-model'

export class InstanceDeleteService {

  // Consts
  clName = 'InstanceDeleteService'

  // Models
  batchJobModel = new BatchJobModel()
  instanceChatSessionModel = new InstanceChatSessionModel()
  instanceModel = new InstanceModel()
  instanceSettingModel = new InstanceSettingModel()
  issueModel = new IssueModel()
  issueTagOptionModel = new IssueTagOptionModel()
  kbFileExtractModel = new KbFileExtractModel()
  kbFileModel = new KbFileModel()
  legalGeoModel = new LegalGeoModel()
  legalGeoTypeModel = new LegalGeoTypeModel()
  newsArticleInstanceModel = new NewsArticleInstanceModel()
  newsArticleQueryModel = new NewsArticleQueryModel()
  proposalModel = new ProposalModel()
  proposalPublishedModel = new ProposalPublishedModel()
  proposalTagOptionModel = new ProposalTagOptionModel()
  voteObjectModel = new VoteObjectModel()

  // Code
  async delete(prisma: any,
               instanceId: string) {

    // Delete batchJobs
    await this.batchJobModel.deleteByInstanceId(
            prisma,
            instanceId)

    // Delete all vote objects (cascade)
    await this.voteObjectModel.deleteByInstanceIdCascade(
            prisma,
            instanceId)

    // Delete proposals
    const proposalsResults = await
            this.proposalModel.filter(
              prisma,
              instanceId,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined)

    for (const proposal of proposalsResults.proposals) {

      await this.proposalModel.deleteCascadeById(
              prisma,
              proposal.id)
    }

    // Delete proposal tag options
    await this.proposalTagOptionModel.deleteByInstanceId(
            prisma,
            instanceId)

    // Delete ProposalPublished
    await this.proposalPublishedModel.deleteByInstanceId(
            prisma,
            instanceId)

    // Delete issues
    const issuesResults = await
            this.issueModel.filter(
              prisma,
              instanceId,
              undefined,
              undefined,
              undefined,
              undefined)

    for (const issue of issuesResults.issues) {

      await this.issueModel.deleteCascadeById(
              prisma,
              issue.id)
    }

    // Delete issue tag options
    await this.issueTagOptionModel.deleteByInstanceId(
            prisma,
            instanceId)

    // Delete KbFiles
    const kbFiles = await
            this.kbFileModel.getByParentIdAndInstanceId(
              prisma,
              undefined,  // parentId
              instanceId)

    for (const kbFile of kbFiles) {

      await this.kbFileModel.deleteCascadeById(
              prisma,
              kbFile.id,
              instanceId)
    }

    // Delete KbFileExtract
    await this.kbFileExtractModel.deleteByInstanceId(
            prisma,
            instanceId)

    // Delete NewsArticleInstance
    await this.newsArticleInstanceModel.deleteByInstanceId(
            prisma,
            instanceId)

    // Delete NewsArticleQuery
    await this.newsArticleQueryModel.deleteByInstanceId(
            prisma,
            instanceId)

    // Delete instanceChatSession
    await this.instanceChatSessionModel.deleteByInstanceId(
            prisma,
            instanceId)

    // Delete InstanceSetting
    await this.instanceSettingModel.deleteByInstanceId(
            prisma,
            instanceId)

    // Delete instance
    await this.instanceModel.deleteById(
            prisma,
            instanceId)
  }

  async deletePending(prisma: any) {

    // Debug
    const fnName = `${this.clName}.deletePending()`

    // Time consts
    const hours1InMs = 1000 * 60 * 60
    const hours24InMs = 24 * 1000 * 60 * 60
    
    // Get instances in D status
    const instancesToDelete = await
            this.instanceModel.filter(
              prisma,
              undefined,  // parentId
              undefined,  // orgType
              undefined,  // instanceType
              BaseDataTypes.deletedStatus,
              undefined)  // publicAccess

    for (const instance of instancesToDelete) {

      if (instance.deleted == null) {
        throw new CustomError(`${fnName}: instance id: ${instance.id} has ` +
                              `status D but deleted is null`)
      }

      // Wait 24 hours before deleting the instance
      if (new Date().getTime() - instance.deleted >= hours24InMs) {

        await this.delete(
                prisma,
                instance.id)
      }
    }
  }

}
