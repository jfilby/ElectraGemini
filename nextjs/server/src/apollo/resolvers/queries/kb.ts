import { prisma } from '@/db'
import { CustomError } from '@/serene-core-server/types/errors'
import { KbFileService } from '@/services/kb/kb-file-service'
import { KbFileContentService } from '@/services/kb/kb-file-content-service'

// Services
const kbFileService = new KbFileService()
const kbFileContentService = new KbFileContentService()

// Code
export async function kbFileExistsByParentIdAndName(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  const fnName = `kbFileExistsByParentIdAndName()`

  // console.log(`${fnName}: args: ` + JSON.stringify(args))

  // Get instances
  var results: any

  try {
    results = await
      kbFileService.existsByParentIdAndName(
        prisma,
        args.parentId,
        args.instanceId,
        args.name,
        args.userProfileId,
        args.refModel,
        true)  // verifyAccess
  } catch (error) {
    if (error instanceof CustomError) {
      return {
        status: false,
        message: error.message
      }
    } else {
      return {
        status: false,
        message: `Unexpected error: ${error}`
      }
    }
  }

  // Return
  return results
}

export async function kbFileById(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  // Debug
  const fnName = `kbFileById()`

  // console.log(`${fnName}: args: ` + JSON.stringify(args))

  // Get KB file/files
  var results: any

  try {
    results = await
      kbFileService.getById(
        prisma,
        args.id,
        args.instanceId,
        args.userProfileId,
        args.includeAcl,
        args.includeFolderFiles,
        args.includeFolderBreadcrumbs,
        true)  // verifyAccess
  } catch (error) {
    if (error instanceof CustomError) {
      return {
        status: false,
        message: error.message
      }
    } else {
      return {
        status: false,
        message: `Unexpected error: ${error}`
      }
    }
  }

  // Get contents
  if (args.includeContents === true &&
      results.kbFile != null) {

    if (results.kbFile.acl.read === true) {

      // The id is known here (could have to be looked up, e.g. if the root node)
      const contentResults = await
              kbFileContentService.getByKbFileId(
                prisma,
                results.kbFile.id,
                args.instanceId,
                args.userProfileId,
                false)  // Verify access

      results.kbFileContent = contentResults.kbFileContent
    }
  }

  // Debug
  // console.log(`${fnName}: results: ` + JSON.stringify(results))

  // Return
  return results
}

export async function searchKbFiles(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  // Search KB files
  var results: any

  try {
    results = await
      kbFileService.search(
        prisma,
        args.instanceId,
        args.userProfileId,
        args.status,
        args.input,
        args.page,
        true)  // verifyAccess
  } catch (error) {
    if (error instanceof CustomError) {
      return {
        status: false,
        message: error.message
      }
    } else {
      return {
        status: false,
        message: `Unexpected error: ${error}`
      }
    }
  }

  // Return
  return results
}
