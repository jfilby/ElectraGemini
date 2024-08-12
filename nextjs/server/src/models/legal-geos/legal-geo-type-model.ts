export class LegalGeoTypeModel {

  // Consts
  clName = 'LegalGeoTypeModel'

  // Code
  async create(
          prisma: any,
          name: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.legalGeoType.create({
        data: {
          name: name
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
    var legalGeoType: any

    try {
      legalGeoType = await prisma.legalGeoType.findUnique({
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
    return legalGeoType
  }

  async getByName(
          prisma: any,
          name: string) {

    // Debug
    const fnName = `${this.clName}.getByName()`

    // Query
    var legalGeoType: any

    try {
      legalGeoType = await prisma.legalGeoType.findFirst({
        where: {
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
    return legalGeoType
  }

  async update(
          prisma: any,
          id: string,
          name: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.legalGeoType.update({
        data: {
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
               name: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // If id isn't specified, try to get by the unique key
    if (id == null &&
        name != null) {

      const legalGeoType = await
              this.getByName(
                prisma,
                name)

      if (legalGeoType != null) {
        id = legalGeoType.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (name == null) {
        console.error(`${fnName}: id is null and name is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 name)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 name)
    }
  }
}
