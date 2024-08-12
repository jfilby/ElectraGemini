import { CustomError } from '@/serene-core-server/types/errors'
import { SereneAiSetup } from '@/serene-ai-server/services/setup/setup-service'
import { IssueTagOptionModel } from '@/models/issues/issue-tag-option-model'
import { ProposalTagOptionModel } from '@/models/proposals/proposal-tag-option-model'
import { VoteObjectModel } from '@/models/voting/vote-object-model'
import { VotePublishQueueModel } from '@/models/voting/vote-publish-queue-model'
import { BaseSetupService } from '@/services/setup/base-setup-service'
import { DemoSetupService } from '@/services/setup/demo-setup-service'
import { DeployVotingSmartContractService } from '../smart-contracts/voting/deploy-service'
import { InteractVotingSmartContractService } from '../smart-contracts/voting/interact-service'
import { IssueService } from '../issues/service'
import { ProposalService } from '../proposals/service'

// Models
const issueTagOptionModel = new IssueTagOptionModel()
const proposalTagOptionModel = new ProposalTagOptionModel()
const voteObjectModel = new VoteObjectModel()
const votePublishQueueModel = new VotePublishQueueModel()

// Services
const baseSetupService = new BaseSetupService()
const demoSetupService = new DemoSetupService()
const issueService = new IssueService()
const proposalService = new ProposalService()
const sereneAiSetup = new SereneAiSetup()

const deployVotingSmartContractService = new DeployVotingSmartContractService()
const interactVotingSmartContractService = new InteractVotingSmartContractService()

// Code
export async function deleteIssuesAndProposals(
                        prisma: any,
                        userProfile: any,
                        redeployVotingSmartContract: boolean) {

  // Debug
  const fnName = 'deleteIssuesAndProposals()'

  console.log(`${fnName}: starting with redeployVotingSmartContract: ` +
              `${redeployVotingSmartContract}`)

  // Run in a transaction
  var results: any

  await prisma.$transaction(async (transactionPrisma: any) => {

    // Delete all vote objects (cascade)
    await voteObjectModel.deleteByInstanceIdCascade(
            transactionPrisma,
            undefined)  // instanceId

    // Delete all proposals
    await proposalService.deleteByInstanceId(
            transactionPrisma,
            undefined)  // instanceId

    // Delete all issues
    await issueService.deleteByInstanceId(
            transactionPrisma,
            undefined)  // instanceId

    // Delete all issue tag options
    await issueTagOptionModel.deleteByInstanceId(
            transactionPrisma,
            undefined)  // instanceId

    // Delete all proposal tag options
    await proposalTagOptionModel.deleteByInstanceId(
            transactionPrisma,
            undefined)  // instanceId
  },
  {
    maxWait: 5 * 60000, // default: 5m
    timeout: 5 * 60000, // default: 5m
    // isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // optional, default defined by database configuration
  })

  // Redeploy the smart contract to make this effective on the blockchain
  var results

  if (redeployVotingSmartContract === true) {

    results = await deployVotingSmartContract(prisma)
  }

  // Return
  return results
}

export async function deleteVotes(
                        prisma: any,
                        userProfile: any,
                        redeployVotingSmartContract: boolean) {

  // Debug
  const fnName = 'deleteVotes()'

  console.log(`${fnName}: starting with redeployVotingSmartContract: ` +
              `${redeployVotingSmartContract}`)

  // Delete all votes to be published
  await votePublishQueueModel.deleteByInstanceId(
          prisma,
          undefined)

  // Delete all vote objects (cascade)
  await voteObjectModel.deleteByInstanceIdCascade(
          prisma,
          undefined)  // instanceId

  // Redeploy the smart contract to make this effective on the blockchain
  var results: any

  if (redeployVotingSmartContract === true) {

    results = await deployVotingSmartContract(prisma)
  }

  // Return
  return results
}

export async function deployVotingSmartContract(prisma: any) {

  // Debug
  const fnName = 'deployVotingSmartContract()'

  console.log(`${fnName}: starting..`)

  // Delete all votes to be published (all of them will be republished later on)
  await votePublishQueueModel.deleteByInstanceId(
    prisma,
    undefined)

  // Deploy the smart contract
  var results = await deployVotingSmartContractService.deploy()

  if (results.status === false) {
    return results
  }

  // Republish all votes in the system
  var results = await
        interactVotingSmartContractService.publishAllVotes(prisma)

  return results
}

export async function setupBaseAndDemoData(
                        prisma: any,
                        userProfile: any) {

  // Debug
  const fnName = 'setupBaseAndDemoData()'

  console.log(`${fnName}: starting..`)

  // Run in a transaction
  var results: any

  try {
    await prisma.$transaction(async (transactionPrisma: any) => {

      // Serene AI setup
      await sereneAiSetup.setup(
              transactionPrisma,
              userProfile.id)

      // Base data
      results = await
        baseSetupService.setup(
          transactionPrisma,
          userProfile.id)

      // Demo data
      if (results.status === true) {

        console.log(`${fnName}: setting up demo data..`)

        results = await
          demoSetupService.setup(
            transactionPrisma,
            userProfile)
      } else {
        console.log(`${fnName}: can't run demo setup`)
      }
    })
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
