import { KbFileModel } from '../kb/kb-file-model'
import { ProposalTagModel } from './proposal-tag-model'

export class ProposalModel {

  // Consts
  clName = 'ProposalModel'

  // Models
  kbFileModel = new KbFileModel()
  proposalTagModel = new ProposalTagModel()

  // Code
  async countByInstance(
          prisma: any,
          instanceId: string) {

    // Debug
    const fnName = `${this.clName}.countByInstance()`

    // Count records
    try {
      return await prisma.proposal.count({
        where: {
          instanceId: instanceId
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async countByIssueId(
          prisma: any,
          issueId: string) {

    // Debug
    const fnName = `${this.clName}.countByIssueId()`

    // Count records
    try {
      return await prisma.proposal.count({
        where: {
          issueId: issueId
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async create(
          prisma: any,
          instanceId: string,
          kbFileId: string,
          issueId: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // console.log(`${fnName}: starting..`)

    // Create record
    try {
      return await prisma.proposal.create({
        data: {
          instanceId: instanceId,
          kbFileId: kbFileId,
          issueId: issueId
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async deleteById(
          prisma: any,
          id: string) {

    // Debug
    const fnName = `${this.clName}.deleteById()`

    // Delete
    try {
      return await prisma.proposal.delete({
        where: {
          id: id
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }
  }

  async deleteCascadeById(
          prisma: any,
          proposalId: string,
          proposal: any = null) {

    // Debug
    const fnName = `${this.clName}.deleteCascadeById()`

    // console.log(`${fnName}: starting..`)

    // Get the Issue record if not given
    if (proposal == null) {

      proposal = await
        this.getById(
          prisma,
          proposalId)
    }

    // Delete the IssueTag records
    await this.proposalTagModel.deleteByProposalId(
            prisma,
            proposalId)

    // Delete the Proposal record
    await this.deleteById(
            prisma,
            proposalId)

    // Delete the KbFile record
    await this.kbFileModel.deleteCascadeById(
            prisma,
            proposal.kbFileId,
            proposal.instanceId)
  }

  async filter(
          prisma: any,
          instanceId: string | undefined,
          kbFileId: string | undefined,
          tag: string | undefined,
          page: number | undefined,
          pageSize: number | undefined,
          issueId: string | undefined,
          includeKbFile: boolean = false,
          orderByName: boolean = false) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Paging
    var skip: number | undefined
    var take: number | undefined

    if (page != null &&
        pageSize != null) {

      skip = page * pageSize
      take = pageSize + 1
    }

    // Query
    var proposals: any = []

    try {
      proposals = await prisma.proposal.findMany({
        skip: skip,
        take: take,
        include: {
          kbFile: includeKbFile
        },
        where: {
          instanceId: instanceId,
          kbFileId: kbFileId,
          issueId: issueId,
          ofProposalTags: tag ? {
            some: {
              proposalTagOption: {
                name: tag
              }
            }
          } : undefined
        },
        orderBy: orderByName ? {
          kbFile: {
            name: 'asc'
          }
        } : undefined
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }

    // hasMore
    var hasMore = false

    if (page != null &&
        pageSize != null &&
        proposals.length > pageSize) {

      hasMore = true
      proposals = proposals.slice(0, pageSize)
    }

    // Return
    return {
      proposals: proposals,
      hasMore: hasMore
    }
  }

  async getById(
          prisma: any,
          id: string,
          includeKbFile: boolean = false,
          includeIssue: boolean = false) {

    // Debug
    const fnName = `${this.clName}.getById()`

    // Query
    var proposal: any = null

    try {
      proposal = await prisma.proposal.findUnique({
        include: {
          issue: includeIssue ? {
            include: {
              kbFile: true
            }
          } : false,
          kbFile: includeKbFile
        },
        where: {
          id: id
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return proposal
  }

  async getByKbFileId(
          prisma: any,
          kbFileId: string,
          includeKbFile: boolean = false) {

    // Debug
    const fnName = `${this.clName}.getByKbFileId()`

    // Query
    var proposal: any = null

    try {
      proposal = await prisma.proposal.findUnique({
        include: {
          kbFile: includeKbFile
        },
        where: {
          kbFileId: kbFileId
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return proposal
  }

  async update(
          prisma: any,
          id: string,
          instanceId: string | undefined,
          kbFileId: string | undefined,
          issueId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.proposal.update({
        data: {
          instanceId: instanceId,
          kbFileId: kbFileId,
          issueId: issueId
        },
        where: {
          id: id
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async upsert(prisma: any,
               id: string | undefined,
               instanceId: string | undefined,
               kbFileId: string | undefined,
               issueId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting..`)

    // Get by kbFileId if id is null
    if (id == null &&
        kbFileId != null) {

      const proposal = await
              this.getByKbFileId(
                prisma,
                kbFileId)

      if (proposal != null) {
        id = proposal.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (instanceId == null) {
        console.error(`${fnName}: id is null and instanceId is null`)
        throw 'Prisma error'
      }

      if (kbFileId == null) {
        console.error(`${fnName}: id is null and kbFileId is null`)
        throw 'Prisma error'
      }

      if (issueId == null) {
        console.error(`${fnName}: id is null and issueId is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 instanceId,
                 kbFileId,
                 issueId)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 instanceId,
                 kbFileId,
                 issueId)
    }
  }
}
