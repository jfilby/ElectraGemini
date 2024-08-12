export class LangModel {

  // Consts
  clName = 'LangModel'

  // Code
  async create(
          prisma: any,
          iso639_2Code: string,
          iso639_1Code: string | undefined,
          name: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.lang.create({
        data: {
          iso639_2Code: iso639_2Code,
          iso639_1Code: iso639_1Code,
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
    var lang: any

    try {
      lang = await prisma.lang.findUnique({
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
    return lang
  }

  async getByIso639_2Code(
          prisma: any,
          iso639_2Code: string) {

    // Debug
    const fnName = `${this.clName}.getByIso639_2Code()`

    // Query
    var lang: any

    try {
      lang = await prisma.lang.findUnique({
        where: {
          iso639_2Code: iso639_2Code
        }
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }

    // Return
    return lang
  }

  async update(
          prisma: any,
          id: string,
          iso639_2Code: string | undefined,
          iso639_1Code: string | undefined,
          name: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.lang.update({
        data: {
          iso639_2Code: iso639_2Code,
          iso639_1Code: iso639_1Code,
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
               iso639_2Code: string | undefined,
               iso639_1Code: string | undefined,
               name: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // If id isn't specified, try to get by the unique key
    if (id == null &&
        iso639_2Code != null) {

      const lang = await
              this.getByIso639_2Code(
                prisma,
                iso639_2Code)

      if (lang != null) {
        id = lang.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (iso639_2Code == null) {
        console.error(`${fnName}: id is null and iso639_2Code is null`)
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
                 iso639_2Code,
                 iso639_1Code,
                 name)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 iso639_2Code,
                 iso639_1Code,
                 name)
    }
  }
}
