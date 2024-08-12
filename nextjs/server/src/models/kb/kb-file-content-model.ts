import { Prisma } from '@prisma/client'

interface KbFileContentSummaryOrText {
  kb_file_id: string
  text: string
  textType: string
}

export class KbFileContentModel {

  // Consts
  clName = 'KbFileContentModel'

  // Code
  async create(
          prisma: any,
          kbFileId: string,
          text: string | undefined,
          summary: string | undefined) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.kbFileContent.create({
        data: {
          kbFileId: kbFileId,
          text: text,
          summary: summary
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
      return await prisma.kbFileContent.delete({
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

  async deleteByKbFileId(
          prisma: any,
          kbFileId: string) {

    // Debug
    const fnName = `${this.clName}.deleteByKbFileId()`

    // Delete many (so no error on not found)
    try {
      return await prisma.kbFileContent.deleteMany({
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
  }

  async getById(
          prisma: any,
          id: string) {

    // Debug
    const fnName = `${this.clName}.getById()`

    // Query
    var kbFileContent: any

    try {
      kbFileContent = await prisma.kbFileContent.findUnique({
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
    return kbFileContent
  }

  async getByKbFileId(
          prisma: any,
          kbFileId: string) {

    // Debug
    const fnName = `${this.clName}.getByKbFileId()`

    // Query
    var kbFileContent: any

    try {
      kbFileContent = await prisma.kbFileContent.findUnique({
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

    // Debug
    // console.log(`${fnName}: kbFileContent: ` + JSON.stringify(kbFileContent))

    // Return
    return kbFileContent
  }

  async getByKbFileIds(
          prisma: any,
          kbFileIds: string[]) {

    // Debug
    const fnName = `${this.clName}.getByKbFileIds()`

    // Raw query
    const kbFileContents = await prisma.$queryRaw<KbFileContentSummaryOrText[]>`
            select kb_file_id,
                   coalesce(summary, text) as text,
                   case
                     when summary is not null then 'S'
                     else 'T' end as text_type
              from kb_file_content
             where kb_file_id in (${Prisma.join(kbFileIds)})`

    // Debug
    // console.log(`${fnName}: kbFileContents: ` +
    //             JSON.stringify(kbFileContents))

    // Return
    return kbFileContents
  }

  async getLatest(
          prisma: any,
          instanceId: string,
          parentId: string | null | undefined,
          refModel: string | null = null) {

    // Debug
    const fnName = `${this.clName}.getLatest()`

    console.log(`${fnName}: instanceId: ${instanceId} refModel: ${refModel}`)

    // Query record
    var latestKbFile: any

    try {
      latestKbFile = await prisma.kbFileContent.findFirst({
        where: {
          kbFile: {
            instanceId: instanceId,
            parentId: parentId,
            refModel: refModel
          }
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

  async getSummaryOrTextByKbFileIdPreferringSummary(
          prisma: any,
          kbFileId: string) {

    // Debug
    const fnName = `${this.clName}.getSummaryOrTextByKbFileIdPreferringSummary()`

    // Raw query
    const kbFileContent = await prisma.$queryRaw`
            select coalesce(summary, text),
                   case 
                     when summary is not null then 'S'
                     else 'T' end
              from kb_file_content
             where kb_file_id = ${kbFileId}`

    // Return
    return {
      text: kbFileContent[0],
      textType: kbFileContent[1]
    }
  }

  async update(
          prisma: any,
          id: string,
          kbFileId: string | undefined,
          text: string | undefined,
          summary: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // console.log(`${fnName}: id: {id} text: ${text}`)

    // Update record
    try {
      return await prisma.kbFileContent.update({
        data: {
          kbFileId: kbFileId,
          text: text,
          summary: summary
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
               kbFileId: string | undefined,
               text: string | undefined,
               summary: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // Get by kbFileId if specified and id isn't specified
    if (id == null &&
        kbFileId != null) {

      const kbFileContent = await
              this.getByKbFileId(
                prisma,
                kbFileId)

      // Debug
      // console.log(`${fnName}: returned with kbFileContent: ` +
      //             JSON.stringify(kbFileContent))

      if (kbFileContent != null) {
        id = kbFileContent.id
      }
    }

    // Debug
    // console.log(`${fnName}: id: ${id}`)

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (kbFileId == null) {
        console.error(`${fnName}: id is null and kbFileId is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 kbFileId,
                 text,
                 summary)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 kbFileId,
                 text,
                 summary)
    }
  }
}
