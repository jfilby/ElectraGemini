import { gql } from '@apollo/client'

export const votingByRefIdQuery = gql`
  query votingByRefId(
          $instanceId: String!,
          $refModel: String!,
          $refId: String!,
          $userProfileId: String!) {
    votingByRefId(
      instanceId: $instanceId,
      refModel: $refModel,
      refId: $refId,
      userProfileId: $userProfileId) {

      status
      message
      voteOptions
      voted
    }
  }
`

export const upsertVoteMutation = gql`
  mutation upsertVote(
             $instanceId: String!,
             $refModel: String!,
             $refId: String!,
             $userProfileId: String!,
             $option: String!) {
    upsertVote(
      instanceId: $instanceId,
      refModel: $refModel,
      refId: $refId,
      userProfileId: $userProfileId,
      option: $option) {

      status
      message
    }
  }
`
