import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { searchProposalsQuery } from '@/apollo/proposals'
import { BaseDataTypes } from '../../../types/base-data-types'

interface Props {
  instanceId: string
  userProfileId: string
  input: string
  page: number
  proposals: any[] | undefined
  setProposals: any
  refresh: boolean
  setRefresh: any
  setIsLoading: any
  setHasMore: any
}

export default function LoadProposalsBySearch({
                          instanceId,
                          userProfileId,
                          input,
                          page,
                          proposals,
                          setProposals,
                          refresh,
                          setRefresh,
                          setIsLoading,
                          setHasMore
                        }: Props) {

  // GraphQL
  const [fetchSearchProposalsQuery] =
    useLazyQuery(searchProposalsQuery, {
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

    console.log(`${fnName}: page: ${page}`)

    // Query
    const searchProposalsData =
      await fetchSearchProposalsQuery(
        {
          variables: {
            instanceId: instanceId,
            userProfileId: userProfileId,
            status: BaseDataTypes.activeStatus,
            input: input,
            page: page
          }
        })

    // Set results
    const results = searchProposalsData.data.searchProposals

    console.log(`${fnName}: results.proposals: ` +
      results.proposals.length)

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
