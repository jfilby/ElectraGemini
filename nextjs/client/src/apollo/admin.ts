import { gql } from '@apollo/client'

export const runSetupMutation = gql`
  mutation runSetup(
             $userProfileId: String!,
             $createOrUpdateBaseAndDemoData: Boolean!,
             $deployVotingSmartContract: Boolean!,
             $deleteVotes: Boolean!,
             $deleteIssuesAndProposals: Boolean!) {
    runSetup(
      userProfileId: $userProfileId,
      createOrUpdateBaseAndDemoData: $createOrUpdateBaseAndDemoData,
      deployVotingSmartContract: $deployVotingSmartContract,
      deleteVotes: $deleteVotes,
      deleteIssuesAndProposals: $deleteIssuesAndProposals) {

      status
      message
    }
  }
`
