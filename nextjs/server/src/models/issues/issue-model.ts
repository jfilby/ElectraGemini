import { IssueTagModel } from './issue-tag-model'
import { KbFileModel } from '../kb/kb-file-model'
import { NewsArticleIssueModel } from '../news-articles/news-article-issue-model'

export class IssueModel {

  // Consts
  clName = 'IssueModel'

  // Models
  issueTagModel = new IssueTagModel()
  kbFileModel = new KbFileModel()
  newsArticleIssueModel = new NewsArticleIssueModel()

  // Code
  async countByInstance(
          prisma: any,
          instanceId: string) {

    // Debug
    const fnName = `${this.clName}.countByInstance()`

    // Count records
    try {
      return await prisma.issue.count({
        where: {
          instanceId: instanceId
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async create(
          prisma: any,
          parentId: string | undefined,
          instanceId: string,
          kbFileId: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.issue.create({
        data: {
          parentId: parentId,
          instanceId: instanceId,
          kbFileId: kbFileId
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
      return await prisma.issue.delete({
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
          issueId: string,
          issue: any = null) {

    // Debug
    const fnName = `${this.clName}.deleteCascadeById()`

    // console.log(`${fnName}: starting..`)

    // Get the Issue record if not given
    if (issue == null) {

      issue = await
        this.getById(
          prisma,
          issueId)
    }

    // Delete the IssueTag records
    await this.issueTagModel.deleteByIssueId(
            prisma,
            issueId)

    // Delete the NewsArticleIssue records
    await this.newsArticleIssueModel.deleteByIssueId(
            prisma,
            issueId)

    // Delete the Issue record
    await this.deleteById(
            prisma,
            issueId)

    // Delete the KbFile record
    await this.kbFileModel.deleteCascadeById(
            prisma,
            issue.kbFileId,
            issue.instanceId)
  }

  async filter(
          prisma: any,
          instanceId: string | undefined,
          kbFileId: string | undefined,
          tag: string | undefined,
          page: number | undefined,
          pageSize: number | undefined,
          includeKbFile: boolean = false,
          orderByName: boolean = false) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Include KbFile if ordering by name
    if (orderByName === true) {
      includeKbFile = true
    }

    // Paging
    var skip: number | undefined
    var take: number | undefined

    if (page != null &&
        pageSize != null) {

      skip = page * pageSize
      take = pageSize + 1
    }

    // Query
    var issues: any[] = []

    try {
      issues = await prisma.issue.findMany({
        skip: skip,
        take: take,
        include: {
          kbFile: includeKbFile
        },
        where: {
          instanceId: instanceId,
          kbFileId: kbFileId,
          ofIssueTags: tag ? {
            some: {
              issueTagOption: {
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
        issues.length > pageSize) {

      hasMore = true
      issues = issues.slice(0, pageSize)
    }

    // Return
    return {
      issues: issues,
      hasMore: hasMore
    }
  }

  async getById(
          prisma: any,
          id: string,
          includeKbFile: boolean = false) {

    // Debug
    const fnName = `${this.clName}.getById()`

    // Query
    var issue: any = null

    try {
      issue = await prisma.issue.findUnique({
        include: {
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
    return issue
  }

  async getByKbFileId(
          prisma: any,
          kbFileId: string,
          includeKbFile: boolean = false) {

    // Debug
    const fnName = `${this.clName}.getByKbFileId()`

    // Query
    var issue: any = null

    try {
      issue = await prisma.issue.findUnique({
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
    return issue
  }

  async update(
          prisma: any,
          id: string,
          parentId: string | undefined,
          instanceId: string | undefined,
          kbFileId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.issue.update({
        data: {
          parentId: parentId,
          instanceId: instanceId,
          kbFileId: kbFileId
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
               parentId: string | undefined,
               instanceId: string | undefined,
               kbFileId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting with id: ${id} parentId: ${parentId} ` +
                `instanceId: ${instanceId} kbFileId: ${kbFileId}`)

    // Get by kbFileId if id is null
    if (id == null &&
        kbFileId != null) {

      const issue = await
              this.getByKbFileId(
                prisma,
                kbFileId)

      if (issue != null) {
        id = issue.id
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

      // Create
      return await
               this.create(
                 prisma,
                 parentId,
                 instanceId,
                 kbFileId)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 parentId,
                 instanceId,
                 kbFileId)
    }
  }
}
