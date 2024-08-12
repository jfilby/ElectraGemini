import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { filterProposalsQuery } from '../../apollo/proposals'
import { BaseDataTypes } from '../../types/base-data-types'

interface Props {
  instanceId: string
  userProfileId: string
  tag: string | null
  page: number
  issueId: string | undefined
  includeIssues: boolean
  proposals: any[] | undefined
  setProposals: any
  refresh: boolean
  setRefresh: any
  setIsLoading: any
  setHasMore: any
}

export default function LoadProposalsByFilter({
                          instanceId,
                          userProfileId,
                          tag,
                          page,
                          issueId,
                          includeIssues,
                          proposals,
                          setProposals,
                          refresh,
                          setRefresh,
                          setIsLoading,
                          setHasMore
                        }: Props) {

  // GraphQL
  const [fetchProposalsQuery] =
    useLazyQuery(filterProposalsQuery, {
      fetchPolicy: 'no-cache'
      /* onCompleted: data => {
        console.log('elementName: ' + elementName)
        console.log(data)
      },
      onError: error => {
        console.log(error)
      } */
    })

  // Functions
  async function getProposals() {

    // Debug
    const fnName = `getProposals()`

    // console.log(`${fnName}: page: ${page}`)

    // Query
    const filterProposalsData =
      await fetchProposalsQuery(
        {
          variables: {
            instanceId: instanceId,
            userProfileId: userProfileId,
            issueId: issueId,
            includeIssues: includeIssues,
            status: BaseDataTypes.activeStatus,
            tag: tag,
            page: page,
            includeContents: true
          }
        })

    // Set results
    const results = filterProposalsData.data.filterProposals

    if (proposals == null) {
      setProposals(results.proposals)
    } else {
      setProposals(proposals.concat(results.proposals))
    }

    if (results.hasMore != null) {
      setHasMore(results.hasMore)
    }

    // Done loading
    setIsLoading(false)
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {
      await getProposals()
    }

    // Only proceed if refresh is true
    if (refresh === false) {
      return
    } else {
      setRefresh(false)
    }

    // Async call
    const result = fetchData()
      .catch(console.error)

  }, [refresh])

  // Render
  return (
    <></>
  )
}
