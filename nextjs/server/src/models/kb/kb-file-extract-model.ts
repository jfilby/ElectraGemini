import { CustomError } from '@/serene-core-server/types/errors'
import { BaseDataTypes } from '@/types/base-data-types'

export class KbFileExtractModel {

  // Consts
  clName = 'KbFileExtractModel'

  // Code
  async create(
          prisma: any,
          instanceId: string,
          purpose: string,
          text: string | undefined) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Debug
    // console.log(`${fnName}: creating KbFileExtract record..`)

    // Validate
    if (!BaseDataTypes.kbFileExtractPurposes.includes(purpose)) {

      throw new CustomError(`${fnName}: invalid purpose: ${purpose}`)
    }

    // Create record
    try {
      return await prisma.kbFileExtract.create({
        data: {
          instanceId: instanceId,
          purpose: purpose,
          text: text
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
      return await prisma.kbFileExtract.delete({
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
          instanceId: string) {

    // Debug
    const fnName = `${this.clName}.deleteByInstanceId()`

    // Delete
    try {
      return await prisma.kbFileExtract.deleteMany({
        where: {
          instanceId: instanceId
        }
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
    var kbFileExtract: any

    try {
      kbFileExtract =  await prisma.kbFileExtract.findUnique({
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
    return kbFileExtract
  }

  async getByInstanceIdAndPurpose(
          prisma: any,
          instanceId: string,
          purpose: string | null = null) {

    // Debug
    const fnName = `${this.clName}.getByInstanceIdAndPurpose()`

    // Query
    try {
      return await prisma.kbFileExtract.findFirst({
        where: {
          instanceId: instanceId,
          purpose: purpose
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }
  }

  async update(
          prisma: any,
          id: string,
          instanceId: string | undefined,
          purpose: string | undefined,
          text: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Validate
    if (purpose != null &&
        !BaseDataTypes.kbFileExtractPurposes.includes(purpose)) {

      throw new CustomError(`${fnName}: invalid purpose: ${purpose}`)
    }

    // Update record
    try {
      return await prisma.kbFileExtract.update({
        data: {
          instanceId: instanceId,
          purpose: purpose,
          text: text
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
               purpose: string | undefined,
               text: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // If id isn't specified, try to get by the unique key
    if (id == null &&
        instanceId != null &&
        purpose != null) {

      const kbFileExtract = await
              this.getByInstanceIdAndPurpose(
                prisma,
                instanceId,
                purpose)

      if (kbFileExtract != null) {
        id = kbFileExtract.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (instanceId == null) {
        console.error(`${fnName}: id is null and instanceId is null`)
        throw 'Prisma error'
      }

      if (purpose == null) {
        console.error(`${fnName}: id is null and purpose is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 instanceId,
                 purpose,
                 text)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 instanceId,
                 purpose,
                 text)
    }
  }
}
