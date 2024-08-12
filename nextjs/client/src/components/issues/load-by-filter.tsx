import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { filterIssuesQuery } from '../../apollo/issues'
import { BaseDataTypes } from '../../types/base-data-types'

interface Props {
  instanceId: string
  userProfileId: string
  tag: string | null
  page: number
  issues: any[] | undefined
  setIssues: any
  refresh: boolean
  setRefresh: any
  setIsLoading: any
  setHasMore: any
  setTagOptions: any
}

export default function LoadIssuesByFilter({
                          instanceId,
                          userProfileId,
                          tag,
                          page,
                          issues,
                          setIssues,
                          refresh,
                          setRefresh,
                          setIsLoading,
                          setHasMore,
                          setTagOptions
                        }: Props) {

  // GraphQL
  const [fetchIssuesQuery] =
    useLazyQuery(filterIssuesQuery, {
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

    // console.log(`${fnName}: page: ${page}`)

    // Query
    const filterIssuesData =
      await fetchIssuesQuery(
        {
          variables: {
            instanceId: instanceId,
            userProfileId: userProfileId,
            status: BaseDataTypes.activeStatus,
            tag: tag,
            page: page,
            includeContents: true
          }
        })

    // Set results
    const results = filterIssuesData.data.filterIssues

    // console.log(`${fnName}: results.issues: ` +
    //             results.issues.length)

    if (issues == null) {
      setIssues(results.issues)
    } else {
      setIssues(issues.concat(results.issues))
    }

    if (results.hasMore != null) {
      setHasMore(results.hasMore)
    }

    if (results.tagOptions != null) {
      setTagOptions(results.tagOptions)
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
