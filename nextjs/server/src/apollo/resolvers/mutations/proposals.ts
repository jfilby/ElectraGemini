import { prisma } from '@/db'
import { CustomError } from '@/serene-core-server/types/errors'
import { UsersService } from '@/serene-core-server/services/users/service'
import { ProposalService } from '@/services/proposals/service'

// Services
const proposalService = new ProposalService()
const usersService = new UsersService()

// Code
export async function deleteProposals(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  const fnName = `deleteProposals()`

  // console.log(`${fnName}: args: ` + JSON.stringify(args))

  // Verify that the user is signed-in
  const signedInUserProfile = await
          usersService.verifySignedInUserProfileId(
            prisma,
            args.userProfileId)

  if (signedInUserProfile === false) {

    return {
      status: false,
      message: `You need to be signed-in to delete proposals.`
    }
  }

  // Delete proposals
  var results: any

  try {
    results = await
      proposalService.deleteByIds(
        prisma,
        args.proposalIds,
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

export async function upsertProposal(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  const fnName = `upsertProposal()`

  // console.log(`${fnName}: args: ` + JSON.stringify(args))

  // Verify that the user is signed-in
  const signedInUserProfile = await
          usersService.verifySignedInUserProfileId(
            prisma,
            args.userProfileId)

  if (signedInUserProfile === false) {

    return {
      status: false,
      message: `You need to be signed-in to create/update proposals.`
    }
  }

  // Upsert proposal
  var results: any

  await prisma.$transaction(async (transactionPrisma) => {

    try {
      results = await
        proposalService.upsert(
          transactionPrisma,
          args.proposalId,
          args.kbFileId,
          args.issueId,
          args.voteSystemId,
          args.voteOpens,
          args.voteCloses,
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

  // Debug
  // console.log(`${fnName}: results: ` + JSON.stringify(results))

  // Return
  return results
}
