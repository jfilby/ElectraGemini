import { IssueTagModel } from './issue-tag-model'

export class IssueTagOptionModel {

  // Consts
  clName = 'IssueTagOptionModel'

  // Models
  issueTagModel = new IssueTagModel()

  // Code
  async create(
          prisma: any,
          parentId: string | null,
          instanceId: string,
          name: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Set tag names to lowercase
    name = name.toLocaleLowerCase()

    // Create record
    try {
      return await prisma.issueTagOption.create({
        data: {
          parentId: parentId,
          instanceId: instanceId,
          name: name
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
      return await prisma.issueTagOption.delete({
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

  async deleteByInstanceId(
          prisma: any,
          instanceId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.deleteByInstanceId()`

    // Delete
    try {
      return await prisma.issueTagOption.deleteMany({
        where: {
          instanceId: instanceId
        }
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async deleteCascadeById(
          prisma: any,
          id: string) {

    // Debug
    const fnName = `${this.clName}.deleteCascadeById()`

    console.log(`${fnName}: starting..`)

    // Delete the IssueTag records
    await this.issueTagModel.deleteByIssueId(
            prisma,
            id)

    // Get and cascade delete the child records
    const children = await
            this.filter(
              prisma,
              id,
              undefined,  // instanceId
              false)      // orderByName

    for (const child of children) {

      await this.deleteCascadeById(
              prisma,
              child.id)
    }

    // Delete the IssueTagOption record
    await this.deleteById(
            prisma,
            id)
  }

  async filter(
          prisma: any,
          parentId: string | null | undefined,
          instanceId: string | undefined,
          orderByName: boolean = false) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.issueTagOption.findMany({
        where: {
          parentId: parentId,
          instanceId: instanceId
        },
        orderBy: orderByName ? {
          name: 'asc'
        } : undefined
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async getById(
          prisma: any,
          id: string) {

    // Debug
    const fnName = `${this.clName}.getById()`

    // Query
    var issueTagOption: any = null

    try {
      issueTagOption = await prisma.issueTagOption.findUnique({
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
    return issueTagOption
  }

  async getByParentIdAndInstanceIdAndName(
          prisma: any,
          parentId: string | null | undefined,
          instanceId: string | undefined,
          name: string | undefined) {

    // Debug
    const fnName = `${this.clName}.getByParentIdAndInstanceIdAndName()`

    // Set tag names to lowercase
    if (name != null) {
      name = name.toLocaleLowerCase()
    }

    // Query
    var issueTagOption: any = null

    try {
      issueTagOption = await prisma.issueTagOption.findFirst({
        where: {
          parentId: parentId,
          instanceId: instanceId,
          name: name
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return issueTagOption
  }

  async update(
          prisma: any,
          id: string,
          parentId: string | null | undefined,
          instanceId: string | undefined,
          name: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Set tag names to lowercase
    if (name != null) {
      name = name.toLocaleLowerCase()
    }

    // Update record
    try {
      return await prisma.issueTagOption.update({
        data: {
          parentId: parentId,
          instanceId: instanceId,
          name: name
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
               parentId: string | null | undefined,
               instanceId: string | undefined,
               name: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // console.log(`${fnName}: starting with id: ${id} parentId: ${parentId} ` +
    //             `name: ${name}`)

    // If id isn't specified try to get by unique key
    // parentId === null is a valid part of a unique combination
    if (id == null &&
        parentId !== undefined &&
        name != null) {

      const issueTagOption = await
              this.getByParentIdAndInstanceIdAndName(
                prisma,
                parentId,
                instanceId,
                name)

      if (issueTagOption != null) {
        id = issueTagOption.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (parentId === undefined) {
        console.error(`${fnName}: id is null and parentId is undefined`)
        throw 'Prisma error'
      }

      if (name == null) {
        console.error(`${fnName}: id is null and name is null`)
        throw 'Prisma error'
      }

      if (instanceId == null) {
        console.error(`${fnName}: id is null and instanceId is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 parentId,
                 instanceId,
                 name)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 parentId,
                 instanceId,
                 name)
    }
  }
}
