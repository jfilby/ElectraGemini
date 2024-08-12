import { prisma } from '@/db'
import { CustomError } from '@/serene-core-server/types/errors'
import { UsersService } from '@/serene-core-server/services/users/service'
import { IssueService } from '@/services/issues/service'

// Services
const issueService = new IssueService()
const usersService = new UsersService()

// Code
export async function deleteIssues(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  const fnName = `deleteIssues()`

  // console.log(`${fnName}: args: ` + JSON.stringify(args))

  // Verify that the user is signed-in
  const signedInUserProfile = await
          usersService.verifySignedInUserProfileId(
            prisma,
            args.userProfileId)

  if (signedInUserProfile === false) {

    return {
      status: false,
      message: `You need to be signed-in to delete issues.`
    }
  }

  // Delete by ids
  var results: any

  try {
    results = await
      issueService.deleteByIds(
        prisma,
        args.issueIds,
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

export async function upsertIssue(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  const fnName = `upsertIssue()`

  // console.log(`${fnName}: args: ` + JSON.stringify(args))

  // Verify that the user is signed-in
  const signedInUserProfile = await
          usersService.verifySignedInUserProfileId(
            prisma,
            args.userProfileId)

  if (signedInUserProfile === false) {

    return {
      status: false,
      message: `You need to be signed-in to create/update issues.`
    }
  }

  // Upsert issue
  var results: any

  await prisma.$transaction(async (transactionPrisma) => {

    try {
      results = await
        issueService.upsert(
          transactionPrisma,
          args.issueId,
          args.parentId,
          args.kbFileId,
          args.status,
          args.name,
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
  })

  // Return
  return results
}
