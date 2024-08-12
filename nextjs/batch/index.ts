// Load the env file
require('dotenv').config({ path: `../server/.env.${process.env.NODE_ENV}` })

// Requires/imports
const { PrismaClient } = require('../server/node_modules/@prisma/client')
import { CustomError } from '@/serene-core-server/types/errors'
import { BatchTypes } from '@/types/batch-types'
import { BatchJobModel } from '@/models/batch/batch-job-model'
import { CleanUpService } from '@/services/clean-up/service'
import { generateIssues, generateProposals } from '@/services/generate/batch-interface'
import { DeployVotingSmartContractService } from '@/services/smart-contracts/voting/deploy-service'
import { InteractVotingSmartContractService } from '@/services/smart-contracts/voting/interact-service'
import { KbFileBatchActionsService } from '@/services/kb/kb-file-batch-actions-service'
import { NewsApiOrgService } from '@/services/apis/newsapi-org-api-service'
import { NewsArticlesService } from '@/services/news-articles/service'
import { TestsService } from '@/services/tests/service'

const prisma = new PrismaClient()

// Services
const cleanUpService = new CleanUpService()
const deployVotingSmartContractService = new DeployVotingSmartContractService()
const interactVotingSmartContractService = new InteractVotingSmartContractService()
const kbFileBatchActionsService = new KbFileBatchActionsService()
const newsApiOrgService = new NewsApiOrgService()
const newsArticlesService = new NewsArticlesService()
const testsService = new TestsService()

// Settings
const concurrentJobs = 4
const sleepSeconds = 1

// Consts
const minutes5InMs = 5 * 60 * 1000
const hours1InMs = 1000 * 60 * 60
const hours6InMs = 6 * 1000 * 60 * 60

// Functions
async function dispatchBatchJobByType(
                 prismaForJob: any,
                 batchJobModelQuery: any,
                 batchJob: any) {

  // Debug
  const fnName = 'dispatchBatchJobByType()'

  // Get parameters
  var parameters: any = null

  if (batchJob.parameters != null) {

    parameters = JSON.parse(batchJob.parameters)
  }

  console.log(`${fnName}: batchJob: ${JSON.stringify(batchJob)}`)
  console.log(`${fnName}: parameters: ${JSON.stringify(parameters)}`)

  // Dispatch by job type
  try {

    switch(batchJob.jobType) {

      case BatchTypes.deployVotingSmartContractJob: {

        return await deployVotingSmartContractService.deploy()
      }

      case BatchTypes.publishPendingVotesJob: {

        return await interactVotingSmartContractService.publishPending(
                       prismaForJob)
      }

      case BatchTypes.buildKbExtractsJob: {

        return await kbFileBatchActionsService.generateKbExtracts(
                       prismaForJob,
                       batchJob.instanceId)
      }

      default: {
        return {
          status: false,
          message: `Unhandled jobType: ${batchJob.jobType}`
        }
      }
    }
  } catch(error) {
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
}

async function generateEmbeddings(prisma: any) {

  // Generate vectors for updated content
  await kbFileBatchActionsService.generateEmbeddings(prisma)

  await newsArticlesService.generateEmbeddings(prisma)
}

async function interval5m(prisma: any) {

  ;
}

async function interval6h(prisma: any) {

  // Debug
  const fnName = 'interval6h'

  console.log(`${fnName}: starting..`)

  // Clean-up
  await cleanUpService.run(prisma)

  // Generate KB extracts relevant to issues & proposals generation
  await kbFileBatchActionsService.generateKbExtracts(prisma)

  // Import news from the API
  await newsApiOrgService.importByCountryTopHeadlines(prisma)

  // Generate embeddings for content (before content generation, in case of
  // batch exceptions due to LLM issues).
  await generateEmbeddings(prisma)
  
  // Generate issues
  await generateIssues(prisma)

  // Generate proposals
  await generateProposals(prisma)

  // Generate embeddings for content (after content generation)
  await generateEmbeddings(prisma)

  // Publish any pending proposals and votes
  // await interactVotingSmartContractService.publishPending(prisma)
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Main batch
(async () => {

  // Debug
  const fnName = 'index.ts'

  // Vars
  var lastInterval5m = new Date().getTime()
  var lastInterval6h = new Date().getTime()

  // Models
  const batchJobModel = new BatchJobModel()

  // Tests
  await testsService.run(prisma)

  // Immediate housekeeping (later runs will be every x minutes)
  await interval5m(prisma)
  await interval6h(prisma)

  // Batch loop
  while (true) {

    // Get pending batch jobs
    const batchJobsPending = await
            batchJobModel.getUniqueByStatus(
              prisma,
              undefined,
              BatchTypes.newBatchJobStatus,
              concurrentJobs)

    // Debug
    // console.log(`${fnName}: batchJobsPending: ${batchJobsPending.length}`)

    // If there are no batch jobs to run, then perform housekeeping at 5m intervals
    if (batchJobsPending.length === 0) {

      if (new Date().getTime() - lastInterval5m >= minutes5InMs) {

        await interval5m(prisma)
        lastInterval5m = new Date().getTime()
      }
    }

    if (new Date().getTime() - lastInterval6h >= hours6InMs) {

      await interval6h(prisma)
      lastInterval6h = new Date().getTime()
    }

    // Get batch jobs as promises to run
    const promises = batchJobsPending.map(async (batchJobPending) => {

      // Run by job type (running in a transaction is optional)
      var results: any = undefined

      if (batchJobPending.runInATransaction === true) {

        // Run in a transaction
        await prisma.$transaction(async (transactionPrisma: any) => {
          results = await
          dispatchBatchJobByType(
            transactionPrisma,
            batchJobModel,
            batchJobPending)
        },
        {
          maxWait: 5 * 60000, // default: 5m
          timeout: 5 * 60000, // default: 5m
          // isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // optional, default defined by database configuration
        })
      } else {

        // Run without a transaction
        results = await
          dispatchBatchJobByType(
            prisma,
            batchJobModel,
            batchJobPending)
      }

      // Handle returning results
      var status: string
      var message: string | null

      if (results.status === true) {
        status = BatchTypes.completedBatchJobStatus
        message = null
      } else {
        status = BatchTypes.failedBatchJobStatus
        message = results.message
      }

      await batchJobModel.upsert(
        prisma,
        batchJobPending.id,
        undefined,
        undefined,
        status,
        undefined,  // progressPct
        message,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined)
    })

    // Sleep 3s if no batch jobs were pending
    if (batchJobsPending.length === 0) {
      const seconds1 = 1000 * sleepSeconds
      await sleep(seconds1 * 3)
    }

    // Execute promises in parallel
    await Promise.all(promises)
  }

  await prisma.$disconnect()
})()
