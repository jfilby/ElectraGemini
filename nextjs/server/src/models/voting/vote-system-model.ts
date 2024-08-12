export class VoteSystemModel {

  // Consts
  clName = 'VoteSystemModel'

  // Code
  async create(
          prisma: any,
          isDefault: boolean,
          isWeighted: boolean,
          isFullyExternal: boolean,
          isBlockchainBased: boolean,
          isBooleanVoteType: boolean,
          voteOptions: string[],
          voteTypeSystem: string | undefined,
          name: string,
          url: string | undefined) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.voteSystem.create({
        data: {
          isDefault: isDefault,
          isWeighted: isWeighted,
          isFullyExternal: isFullyExternal,
          isBlockchainBased: isBlockchainBased,
          isBooleanVoteType: isBooleanVoteType,
          voteOptions: voteOptions,
          voteTypeSystem: voteTypeSystem,
          name: name,
          url: url
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async filter(
          prisma: any,
          isDefault: boolean | undefined,
          isWeighted: boolean | undefined,
          isFullyExternal: boolean | undefined,
          isBlockchainBased: boolean | undefined,
          isBooleanVoteType: boolean | undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.voteSystem.findMany({
        where: {
          isDefault: isDefault,
          isWeighted: isWeighted,
          isFullyExternal: isFullyExternal,
          isBlockchainBased: isBlockchainBased,
          isBooleanVoteType: isBooleanVoteType
        },
        orderBy: [
          {
            name: 'desc'
          }
        ]
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async getDefault(prisma: any) {

    // Debug
    const fnName = `${this.clName}.getDefault()`

    // console.log(`${fnName}: starting..`)

    // Query
    var voteSystem: any = null

    try {
      voteSystem = await prisma.voteSystem.findFirst({
        where: {
          isDefault: true
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return voteSystem
  }

  async getById(
          prisma: any,
          id: string) {

    // Debug
    const fnName = `${this.clName}.getById()`

    // Query
    var voteSystem: any = null

    try {
      voteSystem = await prisma.voteSystem.findUnique({
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
    return voteSystem
  }

  async getByName(
          prisma: any,
          name: string) {

    // Debug
    const fnName = `${this.clName}.getByName()`

    // Query
    var voteSystem: any = null

    try {
      voteSystem = await prisma.voteSystem.findUnique({
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
    return voteSystem
  }

  async update(
          prisma: any,
          id: string,
          isDefault: boolean | undefined,
          isWeighted: boolean | undefined,
          isFullyExternal: boolean | undefined,
          isBlockchainBased: boolean | undefined,
          isBooleanVoteType: boolean | undefined,
          voteOptions: string[] | undefined,
          voteTypeSystem: string | undefined,
          name: string | undefined,
          url: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.voteSystem.update({
        data: {
          isDefault: isDefault,
          isWeighted: isWeighted,
          isFullyExternal: isFullyExternal,
          isBlockchainBased: isBlockchainBased,
          isBooleanVoteType: isBooleanVoteType,
          voteOptions: voteOptions,
          voteTypeSystem: voteTypeSystem,
          name: name,
          url: url
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
               isDefault: boolean | undefined,
               isWeighted: boolean | undefined,
               isFullyExternal: boolean | undefined,
               isBlockchainBased: boolean | undefined,
               isBooleanVoteType: boolean | undefined,
               voteOptions: string[] | undefined,
               voteTypeSystem: string | undefined,
               name: string | undefined,
               url: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // If id not specified, but name is, then get by name
    if (id == null &&
        name != null) {

      const voteSystem = await
              this.getByName(
                prisma,
                name)

      if (voteSystem != null) {
        id = voteSystem.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (isDefault == null) {
        console.error(`${fnName}: id is null and isDefault is null`)
        throw 'Prisma error'
      }

      if (isWeighted == null) {
        console.error(`${fnName}: id is null and isWeighted is null`)
        throw 'Prisma error'
      }

      if (isFullyExternal == null) {
        console.error(`${fnName}: id is null and isFullyExternal is null`)
        throw 'Prisma error'
      }

      if (isBlockchainBased == null) {
        console.error(`${fnName}: id is null and isBlockchainBased is null`)
        throw 'Prisma error'
      }

      if (isBooleanVoteType == null) {
        console.error(`${fnName}: id is null and isBooleanVoteType is null`)
        throw 'Prisma error'
      }

      if (voteOptions == null) {
        console.error(`${fnName}: id is null and voteOptions is null`)
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
                 isDefault,
                 isWeighted,
                 isFullyExternal,
                 isBlockchainBased,
                 isBooleanVoteType,
                 voteOptions,
                 voteTypeSystem,
                 name,
                 url)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 isDefault,
                 isWeighted,
                 isFullyExternal,
                 isBlockchainBased,
                 isBooleanVoteType,
                 voteOptions,
                 voteTypeSystem,
                 name,
                 url)
    }
  }
}
