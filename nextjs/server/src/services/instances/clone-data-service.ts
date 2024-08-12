// This functionality is on-hold
import { KbFileModel } from '@/models/kb/kb-file-model'

export class CloneInstanceDataService {

  // Consts
  clName = 'CloneInstanceDataService'

  // Services
  kbFileModel = new KbFileModel()

  // Code
  async clone(prisma: any,
              fromInstanceId: string,
              toInstanceId: string) {

    // Clone the KB
    await this.cloneKb(
            prisma,
            fromInstanceId,
            toInstanceId)
  }

  async cloneKb(
          prisma: any,
          fromInstanceId: string,
          toInstanceId: string) {

    // Clone the KB files
    const kbFiles = await
            this.kbFileModel.getByParentIdAndInstanceId(
              prisma,
              null,  // parentId
              fromInstanceId)

    // To-do: create the files in the toInstance, recursively
  }
}
