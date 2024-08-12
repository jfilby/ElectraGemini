export class LegalGeoModel {

  // Consts
  clName = 'LegalGeoModel'

  // Code
  async count(
          prisma: any,
          legalGeoTypeId: string) {

    // Debug
    const fnName = `${this.clName}.count()`

    // Create record
    try {
      return await prisma.legalGeo.count({
        where: {
          legalGeoTypeId: legalGeoTypeId
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
          legalGeoTypeId: string,
          country2LetterCode: string | undefined,
          name: string,
          emoji: string | undefined,
          sourceDataId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.legalGeo.create({
        data: {
          parentId: parentId,
          legalGeoTypeId: legalGeoTypeId,
          country2LetterCode: country2LetterCode,
          name: name,
          emoji: emoji,
          sourceDataId: sourceDataId
        }
      })
    } catch(error) {
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
    var legalGeo: any

    try {
      legalGeo = await prisma.legalGeo.findUnique({
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
    return legalGeo
  }

  async getByUniqueKey(
          prisma: any,
          parentId: string | undefined,
          name: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Query
    var legalGeo: any

    try {
      legalGeo = await prisma.legalGeo.findFirst({
        where: {
          parentId: parentId,
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
    return legalGeo
  }

  async getByLegalGeoType(
          prisma: any,
          legalGeoType: string,
          sortByName: boolean = false) {

    // Debug
    const fnName = `${this.clName}.getByLegalGeoType()`

    // Query
    try {
      return await prisma.legalGeo.findMany({
        where: {
          legalGeoType: legalGeoType,
          country2LetterCode: {
            not: null
          }
        },
        orderBy: sortByName ? {
          name: 'asc'
        } : undefined
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async getCountryCodesByInstanceTypesAndStatus(
          prisma: any,
          instanceTypes: string[] | undefined,
          status: string | undefined) {

    // Debug
    const fnName = `${this.clName}.getCountryCodesByInstanceTypesAndStatus()`

    // Query
    try {
      return await prisma.legalGeo.findMany({
        distinct: ['country2LetterCode'],
        select: {
          country2LetterCode: true
        },
        where: {
          ofInstances: {
            some: {
              instanceType: {
                in: instanceTypes
              },
              status: status
            }
          }
        }
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async update(
          prisma: any,
          id: string,
          parentId: string | undefined,
          legalGeoTypeId: string | undefined,
          country2LetterCode: string | undefined,
          name: string | undefined,
          emoji: string | undefined,
          sourceDataId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.legalGeo.update({
        data: {
          parentId: parentId,
          legalGeoTypeId: legalGeoTypeId,
          country2LetterCode: country2LetterCode,
          name: name,
          emoji: emoji,
          sourceDataId: sourceDataId
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
               legalGeoTypeId: string | undefined,
               country2LetterCode: string | undefined,
               name: string | undefined,
               emoji: string | undefined,
               sourceDataId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // If id isn't specified, try to get by the unique key
    if (id == null &&
        name != null &&
        legalGeoTypeId != null) {

      const legalGeo = await
              this.getByUniqueKey(
                prisma,
                parentId,
                name)

      if (legalGeo != null) {
        id = legalGeo.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (name == null) {
        console.error(`${fnName}: id is null and name is null`)
        throw 'Prisma error'
      }

      if (legalGeoTypeId == null) {
        console.error(`${fnName}: id is null and legalGeoTypeId is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 parentId,
                 legalGeoTypeId,
                 country2LetterCode,
                 name,
                 emoji,
                 sourceDataId)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 parentId,
                 legalGeoTypeId,
                 country2LetterCode,
                 name,
                 emoji,
                 sourceDataId)
    }
  }
}
