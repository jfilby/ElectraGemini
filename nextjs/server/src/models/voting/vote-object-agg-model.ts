export class VoteObjectAggModel {

  // Consts
  clName = 'VoteObjectAggModel'

  // Code
  async create(
          prisma: any,
          refModel: string,
          refId: string,
          voteType: string | undefined,
          votes: number | undefined) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.voteObjectAgg.create({
        data: {
          refModel: refModel,
          refId: refId,
          voteType: voteType,
          votes: votes
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
    var voteObjectAgg: any = null

    try {
      voteObjectAgg = await prisma.voteObjectAgg.findUnique({
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
    return voteObjectAgg
  }

  async update(
          prisma: any,
          id: string,
          refModel: string | undefined,
          refId: string | undefined,
          voteType: string | undefined,
          votes: number | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.voteObjectAgg.update({
        data: {
          refModel: refModel,
          refId: refId,
          voteType: voteType,
          votes: votes
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
               refModel: string | undefined,
               refId: string | undefined,
               voteType: string | undefined,
               votes: number | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (refModel == null) {
        console.error(`${fnName}: id is null and refModel is null`)
        throw 'Prisma error'
      }

      if (refId == null) {
        console.error(`${fnName}: id is null and refId is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 refModel,
                 refId,
                 voteType,
                 votes)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 refModel,
                 refId,
                 voteType,
                 votes)
    }
  }
}
