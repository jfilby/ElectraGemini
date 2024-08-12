import { prisma } from '@/db'
import { UsersService } from '@/serene-core-server/services/users/service'
import { deleteIssuesAndProposals, deleteVotes, deployVotingSmartContract, setupBaseAndDemoData } from '@/services/setup/interface'

// Services
const usersService = new UsersService()

// Code
export async function runSetup(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  const fnName = `runSetup()`

  // console.log(`${fnName}: args: ` + JSON.stringify(args))

  // Verify that the user is signed-in, and an admin user
  const signedInUserProfile = await
          usersService.verifySignedInUserProfileId(
            prisma,
            args.userProfileId)

  if (signedInUserProfile === false) {

    return {
      status: false,
      message: `You need to be signed-in as an admin user to run the setup.`
    }
  }

  // Get userProfile
  const userProfile = await
          usersService.getById(
            prisma,
            args.userProfileId)

  if (userProfile.isAdmin === false) {

    return {
      status: false,
      message: `You need to be signed-in as an admin user to run the setup.`
    }
  }

  // Setup
  var results: any
  var redeployVotingSmartContract = true

  // Create or update base and demo data
  if (args.createOrUpdateBaseAndDemoData === true) {

    results = await
      setupBaseAndDemoData(
        prisma,
        userProfile)

    if (results.status === false) {
      return results
    }
  }

  // Delete issues and proposals
  if (args.deleteIssuesAndProposals === true) {

    results = await
      deleteIssuesAndProposals(
        prisma,
        userProfile,
        redeployVotingSmartContract)

    if (results.status === false) {
      return results
    }

    redeployVotingSmartContract = false
  }

  // Delete votes
  if (args.deleteVotes === true) {

    results = await
      deleteVotes(
        prisma,
        userProfile,
        redeployVotingSmartContract)

    if (results.status === false) {
      return results
    }

    redeployVotingSmartContract = false
  }

  // Deploy smart contract (and republish any proposals and votes)
  if (args.deployVotingSmartContract === true &&
      redeployVotingSmartContract === true) {

    results = await deployVotingSmartContract(prisma)

    if (results.status === false) {
      return results
    }
  }

  // Return
  return results
}
