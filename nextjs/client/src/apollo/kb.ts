import { gql } from '@apollo/client'

export const deleteKbFilesMutation = gql`
  mutation deleteKbFiles(
             $kbFileIds: [String]!,
             $instanceId: String!,
             $userProfileId: String!) {
    deleteKbFiles(
      kbFileIds: $kbFileIds,
      instanceId: $instanceId,
      userProfileId: $userProfileId) {

      status
      message
    }
  }
`

export const kbFileExistsByParentIdAndNameQuery = gql`
  query kbFileExistsByParentIdAndName(
             $parentId: String!,
             $name: String!) {
    kbFileExistsByParentIdAndName(
      parentId: $parentId,
      name: $name) {

      status
      found
      message
    }
  }
`

export const getKbFileByIdQuery = gql`
  query kbFileById(
          $id: String,
          $instanceId: String!,
          $userProfileId: String!,
          $includeAcl: Boolean!,
          $includeContents: Boolean!,
          $includeFolderFiles: Boolean!,
          $includeFolderBreadcrumbs: Boolean!) {
    kbFileById(
      id: $id,
      instanceId: $instanceId,
      userProfileId: $userProfileId,
      includeAcl: $includeAcl,
      includeContents: $includeContents,
      includeFolderFiles: $includeFolderFiles,
      includeFolderBreadcrumbs: $includeFolderBreadcrumbs) {

      status
      message
      found
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
      folderFiles {
        id
        format
        createdById
        name
        created
        updated
      }
      folderBreadcrumbs {
        id
        name
      }
    }
  }
`

export const searchKbFilesQuery = gql`
  query searchKbFiles(
          $instanceId: String!,
          $userProfileId: String!,
          $status: String!,
          $input: String!,
          $page: Int!) {
    searchKbFiles(
      instanceId: $instanceId,
      userProfileId: $userProfileId,
      status: $status,
      input: $input,
      page: $page) {

      status
      message
      results {
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

export const upsertKbFileMutation = gql`
  mutation upsertKbFile(
             $kbFileId: String,
             $parentId: String,
             $instanceId: String,
             $publicAccess: String,
             $refModel: String,
             $format: String,
             $name: String,
             $userProfileId: String!) {
    upsertKbFile(
      kbFileId: $kbFileId,
      parentId: $parentId,
      instanceId: $instanceId,
      publicAccess: $publicAccess,
      refModel: $refModel,
      format: $format,
      name: $name,
      userProfileId: $userProfileId) {

      status
      message
    }
  }
`

export const upsertKbFileContentMutation = gql`
  mutation upsertKbFileContent(
             $kbFileId: String,
             $instanceId: String,
             $text: String,
             $summary: String,
             $userProfileId: String!) {
    upsertKbFileContent(
      kbFileId: $kbFileId,
      instanceId: $instanceId,
      text: $text,
      summary: $summary,
      userProfileId: $userProfileId) {

      status
      message
    }
  }
`
