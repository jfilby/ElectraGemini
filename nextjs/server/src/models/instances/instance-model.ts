import { BaseDataTypes } from '@/types/base-data-types'

export class InstanceModel {

  // Consts
  clName = 'InstanceModel'

  // Code
  async create(
          prisma: any,
          parentId: string | undefined,
          instanceType: string,
          orgType: string,
          status: string,
          legalGeoId: string | undefined,
          defaultLangId: string,
          publicAccess: string | undefined,
          createdById: string,
          name: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Created as deleted?
    var deleted: Date | undefined

    if (status === BaseDataTypes.deletedStatus) {
      deleted = new Date()
    }

    // Create record
    try {
      return await prisma.instance.create({
        data: {
          parentId: parentId,
          instanceType: instanceType,
          orgType: orgType,
          status: status,
          legalGeoId: legalGeoId,
          defaultLangId: defaultLangId,
          publicAccess: publicAccess,
          createdById: createdById,
          name: name,
          deleted: deleted
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
      return await prisma.instance.delete({
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

  async filter(
          prisma: any,
          parentId: string | undefined,
          orgType: string | undefined,
          instanceType: string | undefined,
          status: string | undefined,
          publicAccess: string | undefined,
          includeCreatedByUserProfile: boolean = false,
          includeCreatedByUser: boolean = false,
          includeLegalGeo: boolean = true) {

    // Debug
    const fnName = `${this.clName}.filter()`

    /* console.log(`${fnName}: starting with parentId: ${parentId} orgType: ` +
                `${orgType} instanceType: ${instanceType} status: ${status} ` +
                `publicAccess: ${publicAccess} ` +
                `includeCreatedByUserProfile: ${includeCreatedByUserProfile} ` +
                `includeCreatedByUser: ${includeCreatedByUser}` +
                `includeLegalGeo: ${includeLegalGeo}`) */

    // Query
    try {
      return await prisma.instance.findMany({
        include: {
          createdBy: includeCreatedByUserProfile ? {
            include: {
              user: includeCreatedByUser
            }
          } : false,
          legalGeo: includeLegalGeo
        },
        where: {
          parentId: parentId,
          orgType: orgType,
          instanceType: instanceType,
          status: status,
          publicAccess: publicAccess
        },
        orderBy: [
          {
            status: 'asc'
          },
          {
            name: 'asc'
          }
        ]
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async getByInstanceTypesAndStatusAndCountryCode(
          prisma: any,
          instanceTypes: string[] | undefined,
          status: string | undefined,
          country2LetterCode: string | undefined,
          includeLegalGeo: boolean = false) {

    // Debug
    const fnName = `${this.clName}.getByCountryCodeAndStatus()`

    // Query
    try {
      return await prisma.instance.findMany({
        include: {
          legalGeo: includeLegalGeo
        },
        where: {
          instanceType: {
            in: instanceTypes
          },
          status: status,
          legalGeo: {
            country2LetterCode: country2LetterCode
          }
        }
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async getById(
          prisma: any,
          id: string,
          includeCreatedByUserProfile: boolean = false,
          includeCreatedByUser: boolean = false) {

    // Debug
    const fnName = `${this.clName}.getById()`

    // Query
    var instance: any = null

    try {
      instance = await prisma.instance.findUnique({
        include: {
          createdBy: includeCreatedByUserProfile ? {
            include: {
              user: includeCreatedByUser
            }
          } : false,
          legalGeo: {
            include: {
              legalGeoType: true
            }
          }
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
    return instance
  }

  async getByName(
          prisma: any,
          name: string) {

    // Debug
    const fnName = `${this.clName}.getByName()`

    // Query
    var instance: any

    try {
      instance = await prisma.instance.findFirst({
        where: {
          name: name
        }
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }

    // Return
    return instance
  }

  async getByUniqueKey(
          prisma: any,
          name: string,
          createdById: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Query
    var instance: any

    try {
      instance = await prisma.instance.findFirst({
        where: {
          name: name,
          createdById: createdById
        }
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }

    // Return
    return instance
  }

  async update(
          prisma: any,
          id: string,
          parentId: string | undefined,
          instanceType: string | undefined,
          orgType: string | undefined,
          status: string | undefined,
          legalGeoId: string | undefined,
          defaultLangId: string | undefined,
          publicAccess: string | undefined,
          createdById: string | undefined,
          name: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Updated as deleted?
    var deleted: Date | undefined

    if (status === BaseDataTypes.deletedStatus) {
      deleted = new Date()
    }

    // Update record
    try {
      return await prisma.instance.update({
        data: {
          parentId: parentId,
          instanceType: instanceType,
          orgType: orgType,
          status: status,
          legalGeoId: legalGeoId,
          defaultLangId: defaultLangId,
          publicAccess: publicAccess,
          createdById: createdById,
          name: name,
          deleted: deleted
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
               instanceType: string | undefined,
               orgType: string | undefined,
               status: string | undefined,
               legalGeoId: string | undefined,
               defaultLangId: string | undefined,
               publicAccess: string | undefined,
               createdById: string | undefined,
               name: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // If id isn't specified, try to get by the unique key
    if (id == null &&
        name != null &&
        createdById != null) {

      const instance = await
              this.getByUniqueKey(
                prisma,
                name,
                createdById)

      if (instance != null) {
        id = instance.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (instanceType == null) {
        console.error(`${fnName}: id is null and instanceType is null`)
        throw 'Prisma error'
      }

      if (orgType == null) {
        console.error(`${fnName}: id is null and orgType is null`)
        throw 'Prisma error'
      }

      if (status == null) {
        console.error(`${fnName}: id is null and status is null`)
        throw 'Prisma error'
      }

      if (defaultLangId == null) {
        console.error(`${fnName}: id is null and defaultLangId is null`)
        throw 'Prisma error'
      }

      if (createdById == null) {
        console.error(`${fnName}: id is null and createdById is null`)
        throw 'Prisma error'
      }

      if (name == null) {
        console.error(`${fnName}: id is null and name is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 parentId,
                 instanceType,
                 orgType,
                 status,
                 legalGeoId,
                 defaultLangId,
                 publicAccess,
                 createdById,
                 name)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 parentId,
                 instanceType,
                 orgType,
                 status,
                 legalGeoId,
                 defaultLangId,
                 publicAccess,
                 createdById,
                 name)
    }
  }
}
