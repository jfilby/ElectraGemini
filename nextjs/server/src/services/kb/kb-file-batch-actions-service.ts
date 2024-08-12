import { KbBuildExtractsService } from './kb-build-extracts'
import { KbFileService } from './kb-file-service'

export class KbFileBatchActionsService {

  // Consts
  clName = 'KbFileBatchActionsService'

  // Services
  kbBuildExtractsService = new KbBuildExtractsService()
  kbFileService = new KbFileService()

  // Code
  async generateEmbeddings(prisma: any) {

    await this.kbFileService.generateEmbeddings(prisma)
  }

  async generateKbExtracts(
          prisma: any,
          instanceId: string | undefined = undefined) {

    if (instanceId == null) {

      await this.kbBuildExtractsService.run(prisma)
    } else {

      await this.kbBuildExtractsService.runForInstance(
              prisma,
              instanceId)
    }

    // Return
    return {
      status: true
    }
  }
}
