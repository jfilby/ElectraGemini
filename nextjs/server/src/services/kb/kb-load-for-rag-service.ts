import { KbFileTypes } from '@/types/kb-file-types'
import { KbFileContentModel } from '../../models/kb/kb-file-content-model'
import { KbFileModel } from '../../models/kb/kb-file-model'
import { KbPathService } from './kb-path-service'

export class KbLoadForRagService {

  // Consts
  clName = 'KbLoadForRagService'

  // Models
  kbFileContentModel = new KbFileContentModel()
  kbFileModel = new KbFileModel()

  // Code
  async buildOutlineTree(
          prisma: any,
          instanceId: string,
          includeContents: boolean = false,
          includeDirectories: boolean = false) {

    // Debug
    const fnName = `${this.clName}.buildOutlineTree()`

    // Get the KbFile tree
    // Can't filter out directories in this call or it breaks the tree
    var kbFileTree = await
          this.kbFileModel.getTree(
            prisma,
            instanceId,
            null)  // refModel

    // Filter out directories if required
    if (includeDirectories === false) {

      var newKbFileTree: any[] = []

      for (const kbFile of kbFileTree) {

        if (kbFile.format !== KbFileTypes.directoryFormat) {
          newKbFileTree.push(kbFile)
        }
      }

      kbFileTree = newKbFileTree
    }

    // Debug
    // console.log(`${fnName}: kbFileTree: ${JSON.stringify(kbFileTree)}`)

    // Add to results
    var outlineRecords: any[] = []

    if (includeContents === true) {

      outlineRecords = await
        this.getWithContents(
          prisma,
          kbFileTree)
    } else {

      outlineRecords = await
        this.getWithoutContents(
          prisma,
          kbFileTree)
    }

    // Return
    return {
      kb: outlineRecords
    }
  }

  async getWithContents(
          prisma: any,
          kbFileTree: any[]) {

    // Create a map
    var kbFileMap = new Map<string, any>()

    for (const kbFile of kbFileTree) {

      kbFileMap.set(kbFile.id, kbFile)
    }

    // Get kbFileIds
    var kbFileIds: string[] = []

    for (const kbFile of kbFileTree) {
      kbFileIds.push(kbFile.id)
    }

    // Path service, declared within the function scope, so that the duration
    // of the cache is only until the end of this function.
    const kbPathService = new KbPathService()

    // Select content records
    var outlineRecords: any[] = []
    const contentRecordsPerQuery = 10

    while (kbFileIds.length > 0) {

      // Get ids and remove them from kbFileIds
      const kbFileIdsBatch = kbFileIds.splice(0, contentRecordsPerQuery)

      // Debug
      // console.log(`${fnName}: kbFileIdsBatch: ` +
      //             JSON.stringify(kbFileIdsBatch))

      // Query contents
      const kbContentRecords = await
              this.kbFileContentModel.getByKbFileIds(
                prisma,
                kbFileIdsBatch)

      // Debug
      // console.log(`${fnName}: kbContentRecords: ` +
      //             JSON.stringify(kbContentRecords))

      // Build outlineRecords
      for (const kbContentRecord of kbContentRecords) {

        // Get path
        const path = await
                kbPathService.getPath(
                  prisma,
                  kbContentRecord.kb_file_id,
                  '',
                  true)  // cache

        // Debug
        // console.log(`${fnName}: path: ` + JSON.stringify(path))

        // Add outline record
        outlineRecords.push({
          kbFileId: kbContentRecord.kb_file_id,
          path: path?.join('/'),
          text: kbContentRecord.text,
          textType: kbContentRecord.text_type
        })
      }
    }

    return outlineRecords
  }

  async getWithoutContents(
          prisma: any,
          kbFileTree: any[]) {

    // Path service, declared within the function scope, so that the duration
    // of the cache is only until the end of this function.
    const kbPathService = new KbPathService()

    // Debug
    // console.log(`${fnName}: kbContentRecords: ` +
    //             JSON.stringify(kbContentRecords))

    // Build outlineRecords
    var outlineRecords: any[] = []

    for (const kbFile of kbFileTree) {

      // Get path
      const path = await
              kbPathService.getPath(
                prisma,
                kbFile.id,
                '',
                true)  // cache

      // Debug
      // console.log(`${fnName}: path: ` + JSON.stringify(path))

      // Add outline record
      outlineRecords.push({
        kbFileId: kbFile.id,
        path: path?.join('/')
      })
    }

    return outlineRecords
  }
}
