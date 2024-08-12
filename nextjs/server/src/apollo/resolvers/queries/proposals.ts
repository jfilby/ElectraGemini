import { prisma } from '@/db'
import { CustomError } from '@/serene-core-server/types/errors'
import { IssueService } from '@/services/issues/service'
import { ProposalService } from '@/services/proposals/service'

// Services
const issueService = new IssueService()
const proposalService = new ProposalService()

// Code
export async function filterProposals(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  const fnName = `filterProposals()`

  console.log(`${fnName}: args: ` + JSON.stringify(args))

  // Get issues
  var results: any

  try {
    results = await
      proposalService.filter(
        prisma,
        args.issueId,
        args.status,
        args.tag,
        args.page,
        args.instanceId,
        args.userProfileId,
        true,  // includeTagOptions
        args.includeIssues,
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

  // Debug
  // console.log(`${fnName}: results: ` + JSON.stringify(results))

  // Return
  return results
}

export async function proposalById(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  const fnName = `proposalById()`

  // console.log(`${fnName}: args: ` + JSON.stringify(args))

  // Get issues
  var results: any

  try {
    results = await
      proposalService.getById(
        prisma,
        args.id,
        args.instanceId,
        args.userProfileId,
        true,  // includeTagOptions
        true,  // includeIssues
        true)  // verifyAccess

    const issueResults = await
            issueService.getById(
              prisma,
              results.proposal.issueId,
              args.instanceId,
              args.userProfileId,
              true,   // includeTags
              true,   // includeProposalCount
              false,  // includeProposals
              true)   // verifyAccess

    results.proposal.issue = issueResults.issue

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

export async function searchProposals(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  const fnName = `searchProposals()`

  // console.log(`${fnName}: args: ` + JSON.stringify(args))

  // Search proposals
  var results: any

  try {
    results = await
      proposalService.search(
        prisma,
        args.status,
        args.input,
        args.page,
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

  // console.log(`${fnName}: results: ` + JSON.stringify(results))

  // Return
  return results
}
