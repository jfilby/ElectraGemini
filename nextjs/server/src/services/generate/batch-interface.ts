import { BaseDataTypes } from '@/types/base-data-types'
import { InstanceModel } from '@/models/instances/instance-model'
import { GenerateIssuesService } from '@/services/generate/generate-issues-service'
import { GenerateProposalsService } from '@/services/generate/generate-proposals-service'

// Models
const instanceModel = new InstanceModel()

// Code
export async function generateIssues(prisma: any) {

  // Debug
  const fnName = 'generateIssues()'

  // Service
  const generateIssuesService = new GenerateIssuesService()

  // Create any missing data
  // await generateIssuesService.createMissingNewsArticleIssues(prisma)

  // Get the list of active instances
  const instances = await
          instanceModel.getByInstanceTypesAndStatusAndCountryCode(
            prisma,
            [BaseDataTypes.demoInstanceType,
             BaseDataTypes.realInstanceType],
            BaseDataTypes.activeStatus,
            undefined,  // countryCode
            true)       // includeLegalGeo

  // Debug
  // console.log(`${fnName}: instances: ` +
  //             JSON.stringify(instances))

  // Per instance
  for (const instance of instances) {

    // Create any missing data
    await generateIssuesService.createMissingNewsArticleInstances(
            prisma,
            instance.id)

    // Generate results
    const issuesResults = await
            generateIssuesService.generate(
              prisma,
              instance)

    // Debug
    console.log(`${fnName}: issuesResults: ` + JSON.stringify(issuesResults))

    // Save results
    await prisma.$transaction(async (transactionPrisma: any) => {
      await generateIssuesService.save(
              transactionPrisma,
              instance,
              issuesResults)
    },
    {
      maxWait: 5 * 60000, // default: 5m
      timeout: 5 * 60000, // default: 5m
      // isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // optional, default defined by database configuration
    })
  }
}

export async function generateProposals(prisma: any) {

  // Get the list of active instances
  const instances = await
          instanceModel.filter(
            prisma,
            undefined,  // parentId
            undefined,  // orgType
            undefined,  // instanceType
            BaseDataTypes.activeStatus,
            undefined)  // publicAccess

  // Service
  const generateProposalsService = new GenerateProposalsService()

  // Per instance
  for (const instance of instances) {

    // Generate results
    const proposalResults = await
            generateProposalsService.generate(
              prisma,
              instance)

    // Save results
    await prisma.$transaction(async (transactionPrisma: any) => {
      await generateProposalsService.save(
              transactionPrisma,
              proposalResults)
    },
    {
      maxWait: 5 * 60000, // default: 5m
      timeout: 5 * 60000, // default: 5m
      // isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // optional, default defined by database configuration
    })
  }
}
