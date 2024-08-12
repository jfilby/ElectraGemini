// Useful as a service to cache entries per object of class KbPathService

import { CustomError } from '@/serene-core-server/types/errors'
import { KbFileModel } from '../../models/kb/kb-file-model'

export class KbPathService {

  // Consts
  clName = 'KbPathService'

  // Cache map
  cache = new Map<string, string[]>()

  // Models
  kbFileModel = new KbFileModel()

  // Code
  async getPath(
          prisma: any,
          kbFileId: string,
          rootName: string = 'Root',
          cache: boolean = true) {

    // Debug
    const fnName = `${this.clName}.getPath()`

    // Check the cache first
    if (cache === true) {
      if (this.cache.has(kbFileId) === true) {
        return this.cache.get(kbFileId)
      }
    }

    // Vars
    var path: string[] = []

    // Go up the directory hierarchy
    while (kbFileId != null) {

      // Debug
      // console.log(`${fnName}: id: ${id}`)

      // Get record
      const kbFile = await
              this.kbFileModel.getById(
                prisma,
                kbFileId)

      if (kbFile == null) {
        throw new CustomError(`kbFile not found`)
      }

      // Skip top-level directory
      // if (kbFile.parentId == null) {
      //   break
      // }

      // Name root
      var name: string

      if (kbFile.parentId == null) {
        name = rootName
      } else {
        name = kbFile.name
      }

      // Add to breadcrumbs
      path.unshift(name)

      // Get parent id
      kbFileId = kbFile.parentId
    }

    // Debug
    // console.log(`${fnName}: path: ` +
    //             JSON.stringify(folderBreadcrumbs))

    // Add to the cache
    if (cache === true) {
      this.cache.set(kbFileId, path)
    }

    // Return
    return path
  }

  async getPathIdsAndNames(
          prisma: any,
          kbFileId: string,
          rootName: string = 'Root'
        ) {

    // Debug
    const fnName = `${this.clName}.getPath()`

    // Vars
    var path: any[] = []

    // Go up the directory hierarchy
    while (kbFileId != null) {

      // Debug
      // console.log(`${fnName}: id: ${id}`)

      // Get record
      const kbFile = await
              this.kbFileModel.getById(
                prisma,
                kbFileId)

      if (kbFile == null) {
        throw new CustomError(`kbFile not found`)
      }

      // Skip top-level directory
      // if (kbFile.parentId == null) {
      //   break
      // }

      // Name root
      var name: string

      if (kbFile.parentId == null) {
        name = rootName
      } else {
        name = kbFile.name
      }

      // Add to breadcrumbs
      path.unshift({
        id: kbFileId,
        name: name
      })

      // Get parent id
      kbFileId = kbFile.parentId
    }

    // Debug
    // console.log(`${fnName}: path: ` +
    //             JSON.stringify(folderBreadcrumbs))

    // Return
    return path
  }
}
