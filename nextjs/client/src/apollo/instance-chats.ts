import { gql } from '@apollo/client'

export const getInstanceChatSessionsQuery = gql`
  query getInstanceChatSessions(
          $instanceId: String!,
          $userProfileId: String!,
          $status: String) {
    getInstanceChatSessions(
      instanceId: $instanceId,
      userProfileId: $userProfileId,
      status: $status) {

      id
      status
      name
      updated
      chatParticipants {
        id
        userProfileId
        name
      }
    }
  }
`

export const getOrCreateInstanceChatSessionMutation = gql`
  mutation getOrCreateInstanceChatSession(
             $instanceId: String!,
             $userProfileId: String!,
             $issueId: String,
             $proposalId: String,
             $chatSessionId: String) {
    getOrCreateInstanceChatSession(
      instanceId: $instanceId,
      userProfileId: $userProfileId,
      issueId: $issueId,
      proposalId: $proposalId,
      chatSessionId: $chatSessionId) {

      status
      message
      chatSession {
        id
        status
        name
        chatParticipants {
          id
          userProfileId
        }
        issue {
          id
          name
        }
        proposal {
          id
          name
        }
      }
    }
  }
`
