import { gql } from '@apollo/client'

export const cloneInstanceMutation = gql`
  mutation cloneInstance(
             $instanceId: String!,
             $userProfileId: String!,
             $newName: String) {
    cloneInstance(
      instanceId: $instanceId,
      userProfileId: $userProfileId,
      newName: $newName) {

      status
      message
    }
  }
`

export const deleteInstanceMutation = gql`
  mutation deleteInstance(
             $instanceId: String!,
             $userProfileId: String!) {
    deleteInstance(
      instanceId: $instanceId,
      userProfileId: $userProfileId) {

      status
      message
    }
  }
`

export const deleteInstanceSharedPubliclyMutation = gql`
  mutation deleteInstanceSharedPublicly(
             $instanceId: String!,
             $userProfileId: String!) {
    deleteInstanceSharedPublicly(
      instanceId: $instanceId,
      userProfileId: $userProfileId) {

      status
      message
    }
  }
`

export const filterInstancesQuery = gql`
  query filterInstances(
          $orgType: String,
          $instanceType: String,
          $parentId: String,
          $status: String,
          $createdById: String,
          $userProfileId: String!) {
    filterInstances(
      orgType: $orgType,
      instanceType: $instanceType,
      parentId: $parentId,
      status: $status,
      createdById: $createdById,
      userProfileId: $userProfileId) {

      id
      instanceType
      orgType
      status
      legalGeo {
        id
        name
        emoji
      }
      defaultLangId
      createdBy {
        id
        user {
          name
        }
      }
      name
    }
  }
`

export const getInstanceByIdQuery = gql`
  query instanceById(
          $id: String!,
          $userProfileId: String!,
          $includeStats: Boolean!) {
    instanceById(
      id: $id,
      userProfileId: $userProfileId,
      includeStats: $includeStats) {

      id
      instanceType
      orgType
      status
      legalGeo {
        id
        name
        emoji
        legalGeoType {
          name
        }
      }
      defaultLangId
      createdBy {
        id
        user {
          name
        }
      }
      name
      stats {
        issuesCount
        proposalsCount
      }
    }
  }
`

export const getInstanceOptionsQuery = gql`
  query instanceOptions($userProfileId: String!) {
    instanceOptions(userProfileId: $userProfileId) {

      status
      message
      options {
        countries {
          id
          name
        }
      }
    }
  }
`

export const getInstanceSharedGroupsQuery = gql`
  query instanceSharedGroups(
          $id: String!,
          $userProfileId: String!) {
    instanceSharedGroups(
      id: $id,
      userProfileId: $userProfileId) {

      publicly {
        id
        title
        sharedByName
        pinned
        clonable
      }
      shared {
        id
        title
        sharedByName
        clonable
        writable
      }
    }
  }
`

export const getInstancesSharedPubliclyQuery = gql`
  query instancesSharedPublicly {
    instancesSharedPublicly {

      id
      instanceId
      title
      sharedByName
      pinned
      clonable
      writable
    }
  }
`

export const upsertInstanceMutation = gql`
  mutation upsertInstance(
             $id: String,
             $status: String!,
             $legalGeoId: String,
             $userProfileId: String!,
             $name: String) {
    upsertInstance(
      id: $id,
      status: $status,
      legalGeoId: $legalGeoId,
      userProfileId: $userProfileId,
      name: $name) {

      status
      message
      instanceId
    }
  }
`

export const upsertInstanceSharedPubliclyMutation = gql`
  mutation upsertInstanceSharedPublicly(
             $instanceId: String!,
             $userProfileId: String!,
             $pinned: Boolean,
             $clonable: Boolean!) {
    upsertInstanceSharedPublicly(
      instanceId: $instanceId,
      userProfileId: $userProfileId,
      pinned: $pinned,
      clonable: $clonable) {

      status
      message
    }
  }
`
