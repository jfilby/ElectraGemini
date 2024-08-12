export class ModelAttachFeatureModel {

  // Consts
  clName = 'ModelAttachFeatureModel'

  // Code
  async create(
          prisma: any,
          model: string,
          attachFeature: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    console.log(`${fnName}: starting..`)

    // Create record
    try {
      return await prisma.modelAttachFeature.create({
        data: {
          model: model,
          attachFeature: attachFeature
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
      return await prisma.modelAttachFeature.delete({
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
    var modelAttachFeature: any = null

    try {
      modelAttachFeature = await prisma.modelAttachFeature.findUnique({
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
    return modelAttachFeature
  }

  async getByModel(
          prisma: any,
          model: string) {

    // Debug
    const fnName = `${this.clName}.getByModel()`

    // Query
    try {
      return await prisma.modelAttachFeature.findMany({
        where: {
          model: model
        }
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async getByModelAndAttachFeature(
          prisma: any,
          model: string,
          attachFeature: string) {

    // Debug
    const fnName = `${this.clName}.getByModelAndAttachFeature()`

    // Query
    try {
      return await prisma.modelAttachFeature.findFirst({
        where: {
          model: model,
          attachFeature: attachFeature
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
          attachFeature: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.modelAttachFeature.update({
        data: {
          model: model,
          attachFeature: attachFeature
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
               attachFeature: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting..`)

    // Try to get by unique key if id not set
    if (id == null &&
        model != null &&
        attachFeature != null) {

      const modelAttachFeature = await
              this.getByModelAndAttachFeature(
                prisma,
                model,
                attachFeature)

      if (modelAttachFeature != null) {
        id = modelAttachFeature.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (model == null) {
        console.error(`${fnName}: id is null and model is null`)
        throw 'Prisma error'
      }

      if (attachFeature == null) {
        console.error(`${fnName}: id is null and attachFeature is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 model,
                 attachFeature)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 model,
                 attachFeature)
    }
  }
}
