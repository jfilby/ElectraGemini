import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { searchKbFilesQuery } from '@/apollo/kb'
import { BaseDataTypes } from '../../../types/base-data-types'

interface Props {
  instanceId: string
  userProfileId: string
  input: string
  page: number
  results: any[] | undefined
  setResults: any
  refresh: boolean
  setRefresh: any
  setIsLoading: any
  setHasMore: any
}

export default function LoadFilesBySearch({
                          instanceId,
                          userProfileId,
                          input,
                          page,
                          results,
                          setResults,
                          refresh,
                          setRefresh,
                          setIsLoading,
                          setHasMore
                        }: Props) {

  // GraphQL
  const [fetchSearchKbFilesQuery] =
    useLazyQuery(searchKbFilesQuery, {
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
  async function getKbFiles() {

    // Debug
    const fnName = `getKbFiles()`

    console.log(`${fnName}: page: ${page}`)

    // Query
    const searchKbFilesData =
      await fetchSearchKbFilesQuery(
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
    const dataResults = searchKbFilesData.data.searchKbFiles

    console.log(`${fnName}: results.results: ` +
                dataResults.results.length)

    if (results == null) {
      setResults(dataResults.results)
    } else {
      setResults(results.concat(dataResults.results))
    }

    if (dataResults.hasMore != null) {
      setHasMore(dataResults.hasMore)
    }

    // Done loading
    setIsLoading(false)
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {
      await getKbFiles()
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
