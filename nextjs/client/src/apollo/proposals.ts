import { gql } from '@apollo/client'

export const deleteProposalMutation = gql`
  mutation deleteProposals(
             $proposalIds: [String]!,
             $instanceId: String!,
             $userProfileId: String!) {
    deleteProposals(
      proposalIds: $proposalIds,
      instanceId: $instanceId,
      userProfileId: $userProfileId) {

      status
      message
    }
  }
`

export const filterProposalsQuery = gql`
  query filterProposals(
          $issueId: String,
          $status: String,
          $tag: String,
          $page: Int!,
          $instanceId: String!,
          $userProfileId: String!,
          $includeContents: Boolean!,
          $includeIssues: Boolean!) {
    filterProposals(
      issueId: $issueId,
      status: $status,
      tag: $tag,
      page: $page,
      instanceId: $instanceId,
      userProfileId: $userProfileId,
      includeContents: $includeContents,
      includeIssues: $includeIssues) {

      status
      message
      proposals {
        id
        instanceId
        votes
        issue {
          id
          parentId
          kbFile {
            id
            parentId
            name
          }
        }
        kbFile {
          id
          parentId
          format
          createdById
          name
          created
          updated
          snippet
          acl {
            read
            write
          }
        }
        kbFileContent {
          text
          summary
        }
        tags {
          proposalTagOption {
            id
            name
          }
        }
      }
      hasMore
    }
  }
`

export const getProposalByIdQuery = gql`
  query proposalById(
          $id: String,
          $instanceId: String!,
          $userProfileId: String!,
          $includeContents: Boolean!) {
    proposalById(
      id: $id,
      instanceId: $instanceId,
      userProfileId: $userProfileId,
      includeContents: $includeContents) {

      status
      message
      found
      proposal {
        id
        instanceId
        votes
        issue {
          id
          parentId
          instanceId
          kbFile {
            id
            parentId
            name
          }
          tags {
            issueTagOption {
              id
              name
            }
          }
          proposalCount
        }
        kbFile {
          id
          parentId
          format
          createdById
          name
          created
          updated
          acl {
            read
            write
          }
        }
        kbFileContent {
          text
          summary
        }
        tags {
          proposalTagOption {
            id
            name
          }
        }
      }
    }
  }
`

export const searchProposalsQuery = gql`
  query searchProposals(
          $instanceId: String!,
          $userProfileId: String!,
          $status: String!,
          $input: String!,
          $page: Int!) {
    searchProposals(
      instanceId: $instanceId,
      userProfileId: $userProfileId,
      status: $status,
      input: $input,
      page: $page) {

      status
      message
      proposals {
        id
        instanceId
        votes
        tags {
          proposalTagOption {
            id
            name
          }
        }
        kbFile {
          id
          parentId
          instanceId
          format
          createdById
          name
          created
          updated
          snippet
          acl {
            read
            write
          }
        }
      }
      hasMore
    }
  }
`

export const upsertProposalMutation = gql`
  mutation upsertProposal(
             $proposalId: String,
             $issueId: String,
             $instanceId: String,
             $status: String,
             $name: String,
             $userProfileId: String!) {
    upsertProposal(
      proposalId: $proposalId,
      issueId: $issueId,
      instanceId: $instanceId,
      status: $status,
      name: $name,
      userProfileId: $userProfileId) {

      status
      message
    }
  }
`
