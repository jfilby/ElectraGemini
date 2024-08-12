export class TaskNoteModel {

  // Consts
  clName = 'TaskNoteModel'

  // Code
  async create(
          prisma: any,
          taskId: string,
          note: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.taskNote.create({
        data: {
          taskId: taskId,
          note: note
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async getByTaskId(
          prisma: any,
          taskId: string) {

    // Debug
    const fnName = `${this.clName}.getByTaskId()`

    // Query
    try {
      return await prisma.taskNote.findMany({
        where: {
          taskId: taskId
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
          taskId: string,
          note: string) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.taskNote.update({
        data: {
          taskId: taskId,
          note: note
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
               taskId: string,
               note: string) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // Upsert
    if (id == null) {

      // Create
      return await
               this.create(
                 prisma,
                 taskId,
                 note)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 taskId,
                 note)
    }
  }
}
