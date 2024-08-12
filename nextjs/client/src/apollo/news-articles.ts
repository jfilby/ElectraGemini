import { gql } from '@apollo/client'

export const searchNewsArticlesQuery = gql`
  query searchNewsArticles(
          $instanceId: String!,
          $userProfileId: String!,
          $issueId: String,
          $status: String,
          $input: String!,
          $page: Int!) {
    searchNewsArticles(
      instanceId: $instanceId,
      userProfileId: $userProfileId,
      issueId: $issueId,
      status: $status,
      input: $input,
      page: $page) {

      status
      message
      newsArticles {
        id
        url
        title
        snippet
      }
      hasMore
    }
  }
`
