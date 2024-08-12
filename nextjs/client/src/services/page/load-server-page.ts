import { AccessService } from '@/serene-core-client/services/access/service'
import { UsersService } from '@/serene-core-client/services/users/user-service'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { getSession } from 'next-auth/react'
import { defaultUserPreferences } from '@/services/user-preferences/service'
import { InstanceChatsClientService } from '../chats/instance-chats-service'

export async function loadServerPage(
                        context: any,
                        loadChat: boolean = false,
                        verifyLoggedInUsersOnly: boolean = false,
                        verifyAdminUsersOnly: boolean = false) {

  // ApolloClient
  const apolloClient = new ApolloClient({
    uri: process.env.GRAPHQL_URL,
    cache: new InMemoryCache(),
  })

  // console.log('created ApolloClient')

  // URL parameters
  const { accessCode } = context.query
  var { id } = context.query
  var { chatSessionId } = context.query
  var { instanceId } = context.query
  var { issueId } = context.query
  var { kbFileId } = context.query
  var { proposalId } = context.query

  if (id == undefined) {
    id = null
  }

  if (chatSessionId == undefined) {
    chatSessionId = null
  }

  if (instanceId == undefined) {
    instanceId = null
  }

  if (issueId == undefined) {
    issueId = null
  }

  if (kbFileId == undefined) {
    kbFileId = null
  }

  if (proposalId == undefined) {
    proposalId = null
  }

  // Check access
  const accessService = new AccessService()

  var hasAccessCode = false

  if (accessService.validateAccessCode(
        { req: context.req, res: context.res },
        accessCode)) {
    hasAccessCode = true
  }

  // Check isAdmin if required
  if (verifyAdminUsersOnly === true) {

    const results =
            await accessService.validateUserIsAdmin(
              { req: context.req,
                res: context.res },
              apolloClient)

    if (results.status === false) {
      console.error(`Access code validation failed: ${results.message}`)

      return {
        notFound: true,
        props: {
          _status: false
        }
      }
    }
  }

  // Session
  const session = await getSession(context)

  if (verifyLoggedInUsersOnly === true &&
      (session == null)) {

    return {
      redirect: {
        destination: '/account/auth/sign-in',
        permanent: false
      },
      props: {}
    }

    /* return {
      notFound: true,
      props: {
        _status: false
      }
    } */
  }

  // Get/create User
  const usersService = new UsersService()

  const userProfile = await
          usersService.getOrCreateUser(
            { req: context.req, res: context.res },
            session,
            apolloClient,
            defaultUserPreferences)

  // Get/create ChatSession (logged-in users only)
  var chatSession: any = null

  if (loadChat === true) {
      // session != null) {  // Don't require users to be logged in to chat

    const instanceChatsClientService = new InstanceChatsClientService()

    const chatSessionResults = await
            instanceChatsClientService.getOrCreateChatSession(
              apolloClient,
              instanceId,
              userProfile.id,
              issueId,
              proposalId,
              chatSessionId)

    // console.log(`chatSessionResults: ${JSON.stringify(chatSessionResults)}`)

    if (chatSessionResults.chatSession != null) {
      chatSession = chatSessionResults.chatSession
    }
  }

  // Return with empty props
  return {
    props: {
      _status: true,
      hasAccessCode: hasAccessCode,
      id: id,
      chatSession: chatSession,
      instanceId: instanceId,
      issueId: issueId,
      kbFileId: kbFileId,
      proposalId: proposalId,
      userProfile: userProfile,
      clientUrl: process.env.CLIENT_URL,
      serverUrl: process.env.SERVER_URL
    }
  }
}
