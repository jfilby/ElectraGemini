import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { searchIssuesQuery } from '@/apollo/issues'
import { BaseDataTypes } from '../../../types/base-data-types'

interface Props {
  instanceId: string
  userProfileId: string
  input: string
  page: number
  issues: any[] | undefined
  setIssues: any
  refresh: boolean
  setRefresh: any
  setIsLoading: any
  setHasMore: any
}

export default function LoadIssuesBySearch({
                          instanceId,
                          userProfileId,
                          input,
                          page,
                          issues,
                          setIssues,
                          refresh,
                          setRefresh,
                          setIsLoading,
                          setHasMore
                        }: Props) {

  // GraphQL
  const [fetchSearchIssuesQuery] =
    useLazyQuery(searchIssuesQuery, {
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
  async function getIssues() {

    // Debug
    const fnName = `getIssues()`

    console.log(`${fnName}: page: ${page}`)

    // Query
    const searchIssuesData =
      await fetchSearchIssuesQuery(
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
    const results = searchIssuesData.data.searchIssues

    console.log(`${fnName}: results.issues: ` +
      results.issues.length)

    if (issues == null) {
      setIssues(results.issues)
    } else {
      setIssues(issues.concat(results.issues))
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
      await getIssues()
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
