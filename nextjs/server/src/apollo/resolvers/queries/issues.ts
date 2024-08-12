import { prisma } from '@/db'
import { CustomError } from '@/serene-core-server/types/errors'
import { IssueService } from '@/services/issues/service'

// Services
const issueService = new IssueService()

// Code
export async function filterIssues(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  const fnName = `filterIssues()`

  /// console.log(`${fnName}: args: ` + JSON.stringify(args))

  // Get issues
  var results: any

  try {
    results = await
      issueService.filter(
        prisma,
        args.status,
        args.tag,
        args.page,
        args.instanceId,
        args.userProfileId,
        true,  // includeTagOptions
        true,  // includeProposalCount
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

export async function issueById(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  const fnName = `issueById()`

  // console.log(`${fnName}: args: ` + JSON.stringify(args))

  // Get issues
  var results: any

  try {
    results = await
      issueService.getById(
        prisma,
        args.id,
        args.instanceId,
        args.userProfileId,
        true,   // includeTags
        false,  // includeProposalCount
        true,   // includeProposals
        true)   // verifyAccess
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

  // Debug
  // console.log(`${fnName}: results: ` + JSON.stringify(results))

  // Return
  return results
}

export async function searchIssues(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  const fnName = `searchIssues()`

  // console.log(`${fnName}: args: ` + JSON.stringify(args))

  // Search issues
  var results: any

  try {
    results = await
      issueService.search(
        prisma,
        args.status,
        args.input,
        args.page,
        args.instanceId,
        args.userProfileId,
        true,  // includeProposalCount
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

  // console.log(`${fnName}: results: ` + JSON.stringify(results))

  // Return
  return results
}
