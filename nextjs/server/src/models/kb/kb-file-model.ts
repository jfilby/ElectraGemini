import { CustomError } from '@/serene-core-server/types/errors'
import { BaseDataTypes } from '@/types/base-data-types'
import { KbFileContentModel } from './kb-file-content-model'

export class KbFileModel {

  // Consts
  clName = 'KbFileModel'

  // Models
  kbFileContentModel = new KbFileContentModel()

  // Code
  async create(
          prisma: any,
          parentId: string | null,
          instanceId: string,
          createdById: string,
          assignedToId: string | undefined,
          taskId: string | undefined,
          publicAccess: string | null | undefined,
          refModel: string | null | undefined,
          status: string,
          format: string,
          name: string,
          tags: string[],
          refreshEmbedding: boolean) {

    // Debug
    const fnName = `${this.clName}.create()`

    console.log(`${fnName}: starting with instanceId: ${instanceId} ` +
                `createdById: ${createdById}`)

    // Validate refModel if specified
    if (refModel != null) {

      if (!BaseDataTypes.builtInModels.includes(refModel)) {

        throw new CustomError(`${fnName}: refModel: ${refModel} not valid`)
      }
    }

    // If this a root record, verify that no other root already exists
    if (parentId == null) {

      const exists = await
              this.rootExists(
                prisma,
                instanceId,
                refModel)

      if (exists === true) {
        throw new CustomError(`${fnName}: root for instance already exists`)
      }
    }

    // Debug
    console.log(`${fnName}: creating KbFile record..`)

    // Create record
    try {
      return await prisma.kbFile.create({
        data: {
          parentId: parentId,
          instanceId: instanceId,
          createdById: createdById,
          assignedToId: assignedToId,
          taskId: taskId,
          publicAccess: publicAccess,
          refModel: refModel,
          status: status,
          format: format,
          name: name,
          tags: tags,
          refreshEmbedding: refreshEmbedding
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
      return await prisma.kbFile.delete({
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
          id: string,
          instanceId: string) {

    // Get and delete child records
    const children = await
            this.getByParentIdAndInstanceId(
              prisma,
              id,
              instanceId)

    for (const child of children) {

      await this.deleteCascadeById(
              prisma,
              child.id,
              instanceId)
    }

    // Delete the content record
    await this.kbFileContentModel.deleteByKbFileId(
            prisma,
            id)

    // Delete this record
    return await this.deleteById(
                   prisma,
                   id)
  }

  async getById(
          prisma: any,
          id: string,
          includeKbFileContent: boolean = false) {

    // Debug
    const fnName = `${this.clName}.getById()`

    // Query
    var kbFile: any

    try {
      kbFile =  await prisma.kbFile.findUnique({
        include: {
          kbFileContent: includeKbFileContent
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
    return kbFile
  }

  async getByParentIdAndInstanceId(
          prisma: any,
          parentId: string | null | undefined,
          instanceId: string,
          refModel: string | null = null) {  // Should be null if working with the KB itself) {

    // Debug
    const fnName = `${this.clName}.getByParentIdAndInstanceId()`

    // console.log(`${fnName}: starting with parentId: ` +
    //             `${JSON.stringify(parentId)} instanceId: ` +
    //             JSON.stringify(instanceId))

    // Query
    try {
      return await prisma.kbFile.findMany({
        where: {
          parentId: parentId,
          instanceId: instanceId,
          refModel: refModel
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }
  }

  async getByParentIdAndInstanceIdAndName(
          prisma: any,
          parentId: string | null | undefined,
          instanceId: string,
          name: string | null | undefined,
          refModel: string | null | undefined = null) {  // Should be null if working with the KB itself

    // Debug
    const fnName = `${this.clName}.getByParentIdAndInstanceIdAndName()`

    console.log(`${fnName}: parentId: ${parentId} instanceId: ${instanceId} ` +
                `name: ${name} refModel: ${refModel}`)

    // Note: only sure to be unique if refModel is null

    // Query
    var kbFile: any
    try {
      kbFile = await prisma.kbFile.findFirst({
        where: {
          parentId: parentId,
          instanceId: instanceId,
          name: name,
          refModel: refModel
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return kbFile
  }

  async getByRefreshEmbeddingsNeeded(
          prisma: any,
          instanceId: string) {

    // Debug
    const fnName = `${this.clName}.getByRefreshEmbeddingsNeeded()`

    console.log(`${fnName}: starting with instanceId: ${instanceId}`)

    // Query
    try {
      return await prisma.kbFile.findMany({
        where: {
          instanceId: instanceId,
          refreshEmbedding: true
        }
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async getLatest(
          prisma: any,
          instanceId: string,
          parentId: string | null | undefined,
          refModel: string | null = null) {

    // Debug
    const fnName = `${this.clName}.getLatest()`

    // Query record
    var latestKbFile: any

    try {
      latestKbFile = await prisma.kbFile.findFirst({
        where: {
          instanceId: instanceId,
          parentId: parentId,
          refModel: refModel
        },
        orderBy: [
          {
            created: 'desc'
          }
        ],
        take: 1
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return latestKbFile
  }

  async getTree(
          prisma: any,
          instanceId: string,
          refModel: string | null = null) {

    // Debug
    const fnName = `${this.clName}.getTree()`

    // Query (Prisma parameterization handles nulls correctly with the equals syntax)
    if (refModel != null) {

      return await prisma.$queryRaw`
              with recursive cte as (
                select id, parent_id, format
                  from kb_file
                 where instance_id = ${instanceId}
                   and ref_model = ${refModel}
                   and parent_id is null
                union all
                select k.id, k.parent_id, k.format
                  from cte c,
                       kb_file k
                 where k.parent_id = c.id)
              select * from cte`
    } else {

      return await prisma.$queryRaw`
              with recursive cte as (
                select id, parent_id, format
                  from kb_file
                 where instance_id = ${instanceId}
                   and ref_model is null
                   and parent_id is null
                union all
                select k.id, k.parent_id, k.format
                  from cte c,
                       kb_file k
                 where k.parent_id = c.id)
              select * from cte`
    }
  }

  async rootExists(
          prisma: any,
          instanceId: string,
          refModel: string | null = null) {

    // Debug
    const fnName = `${this.clName}.rootExists()`

    // Not for when refModel is set
    if (refModel != null) {
      return false
    }

    // Query: assume this is a KB query (refModel is null)
    var kbFile: any

    try {
      kbFile =  await prisma.kbFile.findFirst({
        where: {
          parentId: null,
          instanceId: instanceId,
          refModel: refModel
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    if (kbFile != null) {
      return true
    } else {
      return false
    }
  }

  async searchEmbeddings(
          prisma: any,
          instanceId: string,
          status: string,
          inputVector: any,
          refModel: string | null,
          page: number = 0,
          pageSize: number = 10) {

    // Debug
    const fnName = `${this.clName}.searchEmbeddings()`

    // console.log(`${fnName}: inputVector: ${inputVector}`)

    if (inputVector == null) {
      throw new CustomError(`${fnName}: inputVector == null`)
    }

    // Calc offset
    const offset = page * pageSize

    // LimitBy is +1 to determine if more records are available
    const limitBy = pageSize + 1

    // Cosine distance threshold:
    // Increase this value to include more documents, but of less relevance.
    const threshold = 0.7

    // Query
    // The order by includes more than the cosine distance to make the ordering
    // unique (required for accurate paging without duplicating records).
    var kbFiles: any[]

    if (refModel === null) {

      kbFiles = await prisma.$queryRaw`
        SELECT id, name, embedding <=> ${inputVector}::vector as "_distance"
          FROM kb_file
         WHERE instance_id = ${instanceId}
           AND status      = ${status}
           AND ref_model  IS NULL
           AND embedding  IS NOT NULL
           AND embedding <=> ${inputVector}::vector <= ${threshold}
         ORDER BY "_distance", name, id ASC
        OFFSET ${offset}
         LIMIT ${limitBy};`
    } else {

      kbFiles = await prisma.$queryRaw`
        SELECT id, name, embedding <=> ${inputVector}::vector as "_distance"
          FROM kb_file
         WHERE instance_id = ${instanceId}
           AND status      = ${status}
           AND ref_model   = ${refModel}
           AND embedding  IS NOT NULL
           AND embedding <=> ${inputVector}::vector <= ${threshold}
         ORDER BY "_distance", name, id ASC
         OFFSET ${offset}
         LIMIT ${limitBy};`
    }

    // Debug
    console.log(`${fnName}: page: ${page} pageSize: ${pageSize} limitBy: ` +
                `${limitBy} kbFiles.length: ${kbFiles.length}`)

    // hasMore
    var hasMore = false

    if (page != null &&
        pageSize != null &&
        kbFiles.length > pageSize) {

      hasMore = true
      kbFiles = kbFiles.slice(0, pageSize)
    }

    // Return
    return {
      kbFiles: kbFiles,
      hasMore: hasMore
    }
  }

  async setEmbedding(
          prisma: any,
          id: string,
          embedding: any) {

    // Debug
    const fnName = `${this.clName}.setEmbedding()`

    // Handle blank embeddings as null (to leave out of search results)
    if (embedding.length === 0) {
      embedding = null
    }

    // Update embedding
    const results = await
      prisma.$executeRaw`UPDATE kb_file SET embedding = ${embedding}, refresh_embedding = false WHERE id = ${id};`

    // console.log(`${fnName}: results: ` + JSON.stringify(results))

    if (results === 0) {
      console.warn(`${fnName}: no rows updated`)
    } else if (results > 1) {
      console.warn(`${fnName}: multiple records (${results} updated for id: ` +
                   `${id}`)
    }
  }

  async update(
          prisma: any,
          id: string,
          parentId: string | null | undefined,
          instanceId: string | undefined,
          createdById: string | undefined,
          assignedToId: string | undefined,
          taskId: string | undefined,
          publicAccess: string | null | undefined,
          refModel: string | null | undefined,
          status: string | undefined,
          format: string | undefined,
          name: string | undefined,
          tags: string[] | undefined,
          refreshEmbedding: boolean | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.kbFile.update({
        data: {
          parentId: parentId,
          instanceId: instanceId,
          createdById: createdById,
          assignedToId: assignedToId,
          taskId: taskId,
          publicAccess: publicAccess,
          refModel: refModel,
          status: status,
          format: format,
          name: name,
          tags: tags,
          refreshEmbedding: refreshEmbedding
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
               createdById: string | undefined,
               assignedToId: string | undefined,
               taskId: string | undefined,
               publicAccess: string | null | undefined,
               refModel: string | null | undefined,
               status: string | undefined,
               format: string | undefined,
               name: string | undefined,
               tags: string[] | undefined,
               refreshEmbedding: boolean | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: parentId: ${parentId} name: ${name}`)

    // If id isn't specified, try to get by the unique key
    if (id == null &&
        parentId !== undefined &&
        instanceId != null &&
        name != null) {

      const kbFile = await
              this.getByParentIdAndInstanceIdAndName(
                prisma,
                parentId,
                instanceId,
                name,
                refModel)

      if (kbFile != null) {
        id = kbFile.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (parentId === undefined) {
        console.error(`${fnName}: id is null and parentId is undefined`)
        throw 'Prisma error'
      }

      if (instanceId == null) {
        console.error(`${fnName}: id is null and instanceId is null`)
        throw 'Prisma error'
      }

      if (createdById == null) {
        console.error(`${fnName}: id is null and createdById is null`)
        throw 'Prisma error'
      }

      if (status == null) {
        console.error(`${fnName}: id is null and status is null`)
        throw 'Prisma error'
      }

      if (format == null) {
        console.error(`${fnName}: id is null and format is null`)
        throw 'Prisma error'
      }

      if (name == null) {
        console.error(`${fnName}: id is null and name is null`)
        throw 'Prisma error'
      }

      if (tags == null) {
        console.error(`${fnName}: id is null and tags is null`)
        throw 'Prisma error'
      }

      if (refreshEmbedding == null) {
        console.error(`${fnName}: id is null and refreshEmbedding is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 parentId,
                 instanceId,
                 createdById,
                 assignedToId,
                 taskId,
                 publicAccess,
                 refModel,
                 status,
                 format,
                 name,
                 tags,
                 refreshEmbedding)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 parentId,
                 instanceId,
                 createdById,
                 assignedToId,
                 taskId,
                 publicAccess,
                 refModel,
                 status,
                 format,
                 name,
                 tags,
                 refreshEmbedding)
    }
  }
}
