import { CustomError } from '@/serene-core-server/types/errors'
import { KbFileTypes } from '@/types/kb-file-types'
import { IssueTagOptionModel } from '@/models/issues/issue-tag-option-model'
import { LegalGeoModel } from '@/models/legal-geos/legal-geo-model'
import { KbFileService } from '@/services/kb/kb-file-service'
import { KbFileContentModel } from '@/models/kb/kb-file-content-model'

export class OrgCommonRecommendedDataSetup {

  // Consts
  clName = 'OrgCommonRecommendedDataSetup'

  // Models
  issueTagOptionModel = new IssueTagOptionModel()
  kbFileContentModel = new KbFileContentModel()
  legalGeoModel = new LegalGeoModel()

  // Services
  kbFileService = new KbFileService()

  // Code
  async setupFiles(
          prisma: any,
          instanceId: string,
          userProfile: any,
          folderResults: any) {

    // Vision & Values/About.md
    const visionAndValuesAboutFileResults = await
            this.kbFileService.upsertFile(
              prisma,
              undefined,                               // kbFileId
              folderResults.visionAndValuesFolder.id,  // parentId
              instanceId,
              undefined,                               // publicAccess
              undefined,                               // refModel
              KbFileTypes.markdownFormat,
              'About.md',
              [],                                      // tags
              userProfile.id,
              false)                                   // verifyAccess

    await this.kbFileContentModel.upsert(
            prisma,
            undefined,  // id
            visionAndValuesAboutFileResults.kbFile.id,
            `This is a party that seeks to apply computing, and especially ` +
            `AI, to help solve the issues people face today. There is also ` +
            `a balance when it comes to applying human, principled solutions.`,
            undefined)  // summary
  }

  async setupFolders(
          prisma: any,
          instanceId: string,
          userProfile: any) {

    // Debug
    const fnName = `${this.clName}.setupFolders()`

    // Validate
    if (userProfile == null) {
      throw new CustomError(`${fnName}: userProfile == null`)
    }

    // Upsert DocumentFolder records
    const rootKbFolderResults = await
            this.kbFileService.upsertFolder(
              prisma,
              undefined,  // id
              null,       // parentId
              instanceId,
              userProfile.id,
              undefined,  // publicAccess
              undefined,  // refModel
              '',
              [],         // tags
              false)      // verifyAccess

    if (rootKbFolderResults == null) {
      throw new CustomError(`${fnName}: rootKbFileResults == null`)
    }

    if (rootKbFolderResults.status === false) {
      throw new CustomError(`${fnName}: failed to create root kbFile`)
    }

    const rootKbFolder = rootKbFolderResults.kbFile

    const visionAndValuesFolderResults = await
            this.kbFileService.upsertFolder(
            prisma,
            undefined,      // id
            rootKbFolder.id,  // parentId
            instanceId,
            userProfile.id,
            undefined,      // publicAccess
            undefined,      // refModel
            'Vision and values',
            [],             // tags
            false)          // verifyAccess

    const visionAndValuesFolder = visionAndValuesFolderResults.kbFile

    await this.kbFileService.upsertFolder(
            prisma,
            undefined,      // id
            rootKbFolder.id,  // parentId
            instanceId,
            userProfile.id,
            undefined,      // publicAccess
            undefined,      // refModel
            'Definitions',
            [],             // tags
            false)          // verifyAccess

    await this.kbFileService.upsertFolder(
            prisma,
            undefined,      // id
            rootKbFolder.id,  // parentId
            instanceId,
            userProfile.id,
            undefined,      // publicAccess
            undefined,      // refModel
            'Guidelines',
            [],             // tags
            false)          // verifyAccess

    await this.kbFileService.upsertFolder(
            prisma,
            undefined,      // id
            rootKbFolder.id,  // parentId
            instanceId,
            userProfile.id,
            undefined,      // publicAccess
            undefined,      // refModel
            'Policies',
            [],             // tags
            false)          // verifyAccess

    await this.kbFileService.upsertFolder(
            prisma,
            undefined,      // id
            rootKbFolder.id,  // parentId
            instanceId,
            userProfile.id,
            undefined,      // publicAccess
            undefined,      // refModel
            'Procedures',
            [],             // tags
            false)          // verifyAccess

    await this.kbFileService.upsertFolder(
            prisma,
            undefined,      // id
            rootKbFolder.id,  // parentId
            instanceId,
            userProfile.id,
            undefined,      // publicAccess
            undefined,      // refModel
            'Checklists',
            [],             // tags
            false)          // verifyAccess

    await this.kbFileService.upsertFolder(
            prisma,
            undefined,      // id
            rootKbFolder.id,  // parentId
            instanceId,
            userProfile.id,
            undefined,      // publicAccess
            undefined,      // refModel
            'FAQs',
            [],             // tags
            false)          // verifyAccess

    // Return
    return {
      visionAndValuesFolder: visionAndValuesFolder
    }
  }

  async setup(
          prisma: any,
          instance: any,
          userProfile: any) {

    // Debug
    const fnName = `${this.clName}.setup()`

    console.log(`${fnName}: starting for instanceId: ${instance.id}`)

    // Setup common KB folders and files
    const folderResults = await
            this.setupFolders(
              prisma,
              instance.id,
              userProfile)

    await this.setupFiles(
            prisma,
            instance.id,
            userProfile,
            folderResults)
  }
}
