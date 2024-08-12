export class InstanceChatSessionModel {

  // Consts
  clName = 'InstanceChatSessionModel'

  // Code
  async create(
          prisma: any,
          instanceId: string,
          createdById: string,
          chatSessionId: string,
          issueId: string | undefined,
          proposalId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.instanceChatSession.create({
        data: {
          instanceId: instanceId,
          createdById: createdById,
          chatSessionId: chatSessionId,
          issueId: issueId,
          proposalId: proposalId
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async deleteByChatSessionId(
          prisma: any,
          chatSessionId: string) {

    // Debug
    const fnName = `${this.clName}.deleteByChatSessionId()`

    // Delete records
    try {
      await prisma.instanceChatSession.deleteMany({
        where: {
          chatSessionId: chatSessionId
        }
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async deleteByInstanceId(
          prisma: any,
          instanceId: string) {

    // Debug
    const fnName = `${this.clName}.deleteByInstanceId()`

    // Delete records
    try {
      await prisma.instanceChatSession.deleteMany({
        where: {
          instanceId: instanceId
        }
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async filterChatSession(
          prisma: any,
          instanceId: string | undefined,
          createdById: string | undefined,
          status: string | undefined) {

    // Debug
    const fnName = `${this.clName}.filterChatSession()`

    // Query
    try {
      return await prisma.chatSession.findMany({
        where: {
          status: status,
          ofInstanceChatSessions: {
            some: {
              instanceId: instanceId,
              createdById: createdById
            }
          }
        },
        orderBy: [
          {
            created: 'desc'
          }
        ]
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
    var instanceChatSession: any = null

    try {
      instanceChatSession = await prisma.instanceChatSession.findUnique({
        include: {
          createdBy: includeCreatedByUserProfile ? {
            include: {
              user: includeCreatedByUser
            }
          } : false,
          legalGeo: true
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
    return instanceChatSession
  }

  // This is better than get by chatSessionId (unique), because it validates
  // the 3 fields in combination.
  async getByNonPkFields(
          prisma: any,
          instanceId: string,
          createdById: string,
          chatSessionId: string,
          includeChatSession: boolean = false) {

    // Debug
    const fnName = `${this.clName}.getByNonPkFields()`

    // Query
    var instanceChatSession: any

    try {
      instanceChatSession = await prisma.instanceChatSession.findFirst({
        include: {
          chatSession: includeChatSession,
        },
        where: {
          instanceId: instanceId,
          createdById: createdById,
          chatSessionId: chatSessionId
        }
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }

    // Return
    return instanceChatSession
  }

  async update(
          prisma: any,
          id: string,
          instanceId: string | undefined,
          createdById: string | undefined,
          chatSessionId: string | undefined,
          issueId: string | undefined,
          proposalId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.instanceChatSession.update({
        data: {
          instanceId: instanceId,
          createdById: createdById,
          chatSessionId: chatSessionId,
          issueId: issueId,
          proposalId: proposalId
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
               createdById: string | undefined,
               chatSessionId: string | undefined,
               issueId: string | undefined,
               proposalId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // If id isn't specified, try to get by the unique key
    if (id == null &&
        instanceId != null &&
        createdById != null &&
        chatSessionId != null) {

      const instanceChatSession = await
              this.getByNonPkFields(
                prisma,
                instanceId,
                createdById,
                chatSessionId)

      if (instanceChatSession != null) {
        id = instanceChatSession.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (instanceId == null) {
        console.error(`${fnName}: id is null and instanceId is null`)
        throw 'Prisma error'
      }

      if (createdById == null) {
        console.error(`${fnName}: id is null and createdById is null`)
        throw 'Prisma error'
      }

      if (chatSessionId == null) {
        console.error(`${fnName}: id is null and chatSessionId is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 instanceId,
                 createdById,
                 chatSessionId,
                 issueId,
                 proposalId)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 instanceId,
                 createdById,
                 chatSessionId,
                 issueId,
                 proposalId)
    }
  }
}
