import { gql } from '@apollo/client'

export const deleteIssueMutation = gql`
  mutation deleteIssues(
             $issueIds: [String]!,
             $instanceId: String!,
             $userProfileId: String!) {
    deleteIssues(
      issueIds: $issueIds,
      instanceId: $instanceId,
      userProfileId: $userProfileId) {

      status
      message
    }
  }
`

export const filterIssuesQuery = gql`
  query filterIssues(
          $status: String,
          $tag: String,
          $page: Int!,
          $instanceId: String!,
          $userProfileId: String!,
          $includeContents: Boolean!) {
    filterIssues(
      status: $status,
      tag: $tag,
      page: $page,
      instanceId: $instanceId,
      userProfileId: $userProfileId,
      includeContents: $includeContents) {

      status
      message
      issues {
        id
        instanceId
        proposalCount
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
          issueTagOption {
            id
            name
          }
        }
      }
      hasMore
      tagOptions
    }
  }
`

export const getIssueByIdQuery = gql`
  query issueById(
          $id: String,
          $instanceId: String!,
          $userProfileId: String!,
          $includeContents: Boolean!) {
    issueById(
      id: $id,
      instanceId: $instanceId,
      userProfileId: $userProfileId,
      includeContents: $includeContents) {

      status
      message
      found
      issue {
        id
        instanceId
        proposalCount
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
          issueTagOption {
            id
            name
          }
        }
        proposals {
          id
          instanceId
          votes
          kbFile {
            id
            name
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
  }
`

export const searchIssuesQuery = gql`
  query searchIssues(
          $instanceId: String!,
          $userProfileId: String!,
          $status: String!,
          $input: String!,
          $page: Int!) {
    searchIssues(
      instanceId: $instanceId,
      userProfileId: $userProfileId,
      status: $status,
      input: $input,
      page: $page) {

      status
      message
      issues {
        id
        instanceId
        proposalCount
        tags {
          issueTagOption {
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

export const upsertIssueMutation = gql`
  mutation upsertIssue(
             $issueId: String,
             $parentId: String,
             $instanceId: String,
             $status: String,
             $name: String,
             $userProfileId: String!) {
    upsertIssue(
      issueId: $issueId,
      parentId: $parentId,
      instanceId: $instanceId,
      status: $status,
      name: $name,
      userProfileId: $userProfileId) {

      status
      message
    }
  }
`
