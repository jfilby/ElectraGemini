export class ModelAttachModel {

  // Consts
  clName = 'ModelAttachModel'

  // Code
  async create(
          prisma: any,
          model: string,
          relation: string,
          attachModel: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    console.log(`${fnName}: starting..`)

    // Create record
    try {
      return await prisma.modelAttach.create({
        data: {
          model: model,
          relation: relation,
          attachModel: attachModel
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
      return await prisma.modelAttach.delete({
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

  async getById(
          prisma: any,
          id: string) {

    // Debug
    const fnName = `${this.clName}.getById()`

    // Query
    var modelAttach: any = null

    try {
      modelAttach = await prisma.modelAttach.findUnique({
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
    return modelAttach
  }

  async getByModel(
          prisma: any,
          model: string) {

    // Debug
    const fnName = `${this.clName}.getByModel()`

    // Query
    try {
      return await prisma.modelAttach.findMany({
        where: {
          model: model
        }
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async getByModelAndAttachModel(
          prisma: any,
          model: string,
          attachModel: string) {

    // Debug
    const fnName = `${this.clName}.getByModelAndAttachModel()`

    // Query
    try {
      return await prisma.modelAttach.findFirst({
        where: {
          model: model,
          attachModel: attachModel
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
          model: string | undefined,
          relation: string | undefined,
          attachModel: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.modelAttach.update({
        data: {
          model: model,
          relation: relation,
          attachModel: attachModel
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
               model: string | undefined,
               relation: string | undefined,
               attachModel: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting..`)

    // Try to get by unique key if id not specified
    if (id == null &&
        model != null &&
        attachModel != null) {

      const modelAttach = await
              this.getByModelAndAttachModel(
                prisma,
                model,
                attachModel)

      if (modelAttach != null) {
        id = modelAttach.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (model == null) {
        console.error(`${fnName}: id is null and model is null`)
        throw 'Prisma error'
      }

      if (relation == null) {
        console.error(`${fnName}: id is null and relation is null`)
        throw 'Prisma error'
      }

      if (attachModel == null) {
        console.error(`${fnName}: id is null and attachModel is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 model,
                 relation,
                 attachModel)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 model,
                 relation,
                 attachModel)
    }
  }
}
