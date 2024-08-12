import { CustomError } from '@/serene-core-server/types/errors'
import { BatchTypes } from '@/types/batch-types'
import { KbFileTypes } from '@/types/kb-file-types'
import { BatchJobModel } from '@/models/batch/batch-job-model'
import { KbFileContentModel } from '@/models/kb/kb-file-content-model'
import { KbFileModel } from '@/models/kb/kb-file-model'
import { KbFileService } from './kb-file-service'

export class KbFileContentService {

  // Consts
  clName = 'KbFileContentService'

  // Models
  batchJobModel = new BatchJobModel()
  kbFileContentModel = new KbFileContentModel()
  kbFileModel = new KbFileModel()

  // Services
  kbFileService = new KbFileService()

  // Code
  async getByKbFileId(
          prisma: any,
          kbFileId: string,
          instanceId: string,
          userProfileId: string,
          verifyAccess: boolean) {

    // Debug
    const fnName = `${this.clName}.getByKbFileId()`

    console.log(`${fnName}: starting with kbFileId: ${kbFileId} and ` +
                `verifyAccess: ${verifyAccess}`)

    // Initial validation
    if (kbFileId == null) {
      throw new CustomError(`${fnName}: kbFileId == null`)
    }

    if (instanceId == null) {
      throw new CustomError(`${fnName}: instanceId == null`)
    }

    // Get the KbFile and verify access
    const kbFileResults = await
            this.kbFileService.getById(
              prisma,
              kbFileId,
              instanceId,
              userProfileId,
              true,   // includeAcl
              false,  // includeFolderFiles
              false,  // includeFolderBreadcrumbs
              verifyAccess)

    if (kbFileResults.status === false) {

      return {
        status: false,
        message: kbFileResults.message,
        kbFileContent: undefined,
        acl: undefined
      }
    }

    // Get record if access permits
    var kbFileContent: any

    if (kbFileResults.kbFile.format !== KbFileTypes.directoryFormat &&
        kbFileResults.kbFile.acl.read === true) {

      kbFileContent = await
        this.kbFileContentModel.getByKbFileId(
          prisma,
          kbFileId)
    }

    // Return
    // console.log(`${fnName}: returning..`)

    return {
      status: true,
      kbFileContent: kbFileContent,
      acl: kbFileResults.kbFile.acl
    }
  }

  async upsert(
          prisma: any,
          kbFileId: string,
          instanceId: string,
          text: string | undefined,
          summary: string | undefined,
          userProfileId: string) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // console.log(`${fnName}: starting with kbFileId: ${kbFileId} text: ${text}`)

    // Get the KbFile and verify access
    const kbFileResults = await
            this.kbFileService.getById(
              prisma,
              kbFileId,
              instanceId,
              userProfileId,
              true,   // includeAcl
              false,  // includeFolderFiles
              false,  // includeFolderBreadcrumbs
              true)

    // Return early if access doesn't permit
    if (kbFileResults.kbFile.acl.write === false) {
      return {
        status: false,
        message: 'Access denied'
      }
    }

    // Get existing record
    const kbFileContentBefore = await
            this.kbFileContentModel.getByKbFileId(
              prisma,
              kbFileId)

    // Return early if there are no text changes
    if (kbFileContentBefore != null) {
      if (text === kbFileContentBefore.text) {
        return {
          status: true,
          kbFileContent: kbFileContentBefore
        }
      }
    } else {
      if (text == null || text === '') {
        return {
          status: true,
          kbFileContent: undefined
        }
      }
    }

    // Debug
    // console.log(`${fnName}: upserting with kbFileId: ${kbFileId} ` +
    //             `text: ${text}`)

    // Upsert KbFileContent record
    const kbFileContent = await
            this.kbFileContentModel.upsert(
              prisma,
              undefined,  // id
              kbFileId,
              text,
              summary)

    // Set embeddingRefresh to true on the KbFile record
    await this.kbFileModel.update(
            prisma,
            kbFileId,
            undefined,  // parentId
            undefined,  // instanceId
            undefined,  // createdById
            undefined,  // assignedToId
            undefined,  // taskId
            undefined,  // publicAccess
            undefined,  // refModel
            undefined,  // status
            undefined,  // format
            undefined,  // name
            undefined,  // tags
            true)       // refreshEmbedding

    // Add a batch record for additional processing
    const batchJob = await
            this.batchJobModel.create(
              prisma,
              instanceId,
              true,                             // runInATransaction
              BatchTypes.newBatchJobStatus,
              0,                                // processPct
              undefined,                        // message
              BatchTypes.buildKbExtractsJob,    // jobType
              BatchTypes.kbFileContentModel,    // refModel
              kbFileContent.id,                 // refId
              undefined,                        // parameters
              userProfileId)

    // Return
    return {
      status: true,
      kbFileContent: kbFileContent
    }
  }
}
