import { getOrCreateInstanceChatSessionMutation } from '@/apollo/instance-chats'

export class InstanceChatsClientService {

  // Consts
  clName = 'InstanceChatsClientService'

  // Code
  async getOrCreateChatSession(
          apolloClient: any,
          instanceId: string,
          userProfileId: string,
          issueId: string | undefined,
          proposalId: string | undefined,
          chatSessionId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.getOrCreate()`

    console.log(`${fnName}: chatSessionId: ${JSON.stringify(chatSessionId)}`)

    // GraphQL call to get or create instance chat session
    var results: any = null

    await apolloClient.mutate({
      mutation: getOrCreateInstanceChatSessionMutation,
      variables: {
        instanceId: instanceId,
        userProfileId: userProfileId,
        issueId: issueId,
        proposalId: proposalId,
        chatSessionId: chatSessionId
      }
    }).then((result: any) => results = result)
      .catch((error: { networkError: any }) => {
        console.log(`${fnName}: error: ${error}`)
        console.log(`${fnName}: error.networkError: ${JSON.stringify(error.networkError)}`)
      })

    // Get data
    const resultsData = results.data.getOrCreateInstanceChatSession

    // console.log(`${fnName}: resultsData: ${JSON.stringify(resultsData)}`)

    // Return
    return resultsData
  }
}
