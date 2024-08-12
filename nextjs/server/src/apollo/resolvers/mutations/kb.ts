import { prisma } from '@/db'
import { UsersService } from '@/serene-core-server/services/users/service'
import { CustomError } from '@/serene-core-server/types/errors'
import { KbFileService } from '@/services/kb/kb-file-service'
import { KbFileContentService } from '@/services/kb/kb-file-content-service'

// Services
const kbFileService = new KbFileService()
const kbFileContentService = new KbFileContentService()
const usersService = new UsersService()

// Code
export async function deleteKbFiles(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  const fnName = `deleteKbFiles()`

  // console.log(`${fnName}: args: ` + JSON.stringify(args))

  // Verify that the user is signed-in
  const signedInUserProfile = await
          usersService.verifySignedInUserProfileId(
            prisma,
            args.userProfileId)

  if (signedInUserProfile === false) {

    return {
      status: false,
      message: `You need to be signed-in to delete files/folders.`
    }
  }

  // Delete KB files
  var results: any

  try {
    results = await
      kbFileService.deleteByIds(
        prisma,
        args.kbFileIds,
        args.instanceId,
        args.userProfileId,
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

export async function upsertKbFile(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  const fnName = `upsertKbFile()`

  console.log(`${fnName}: args: ` + JSON.stringify(args))

  // Verify that the user is signed-in
  const signedInUserProfile = await
          usersService.verifySignedInUserProfileId(
            prisma,
            args.userProfileId)

  if (signedInUserProfile === false) {

    return {
      status: false,
      message: `You need to be signed-in to create/update files/folders.`
    }
  }

  // Upsert KbFile
  var results: any

  try {
    results = await
      kbFileService.upsertFile(
        prisma,
        args.kbFileId,
        args.parentId,
        args.instanceId,
        args.publicAccess,
        args.refModel,
        args.format,
        args.name,
        args.contents,
        args.userProfileId,
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

export async function upsertKbFileContent(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  const fnName = `upsertKbFileContent()`

  // console.log(`${fnName}: args: ` + JSON.stringify(args))

  // Verify that the user is signed-in
  const signedInUserProfile = await
          usersService.verifySignedInUserProfileId(
            prisma,
            args.userProfileId)

  if (signedInUserProfile === false) {

    return {
      status: false,
      message: `You need to be signed-in to create/update file content.`
    }
  }

  // Upsert content
  var results: any

  try {
    results = await
      kbFileContentService.upsert(
        prisma,
        args.kbFileId,
        args.instanceId,
        args.text,
        args.summary,
        args.userProfileId)
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
