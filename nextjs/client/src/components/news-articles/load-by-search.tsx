import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { searchNewsArticlesQuery } from '../../apollo/news-articles'
import { BaseDataTypes } from '../../types/base-data-types'

interface Props {
  instanceId: string
  userProfileId: string
  page: number
  issueId: string | undefined
  input: string
  newsArticles: any[] | undefined
  setNewsArticles: any
  refresh: boolean
  setRefresh: any
  setIsLoading: any
  setHasMore: any
}

export default function LoadNewsArticlesBySearch({
                          instanceId,
                          userProfileId,
                          page,
                          issueId,
                          input,
                          newsArticles,
                          setNewsArticles,
                          refresh,
                          setRefresh,
                          setIsLoading,
                          setHasMore
                        }: Props) {

  // GraphQL
  const [fetchNewsArticlesQuery] =
    useLazyQuery(searchNewsArticlesQuery, {
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
  async function getNewsArticles() {

    // Debug
    const fnName = `getNewsArticles()`

    // console.log(`${fnName}: page: ${page}`)

    // Query
    const searchNewsArticlesData =
      await fetchNewsArticlesQuery(
        {
          variables: {
            instanceId: instanceId,
            userProfileId: userProfileId,
            issueId: issueId,
            status: BaseDataTypes.activeStatus,
            input: input,
            page: page,
            includeContents: true
          }
        })

    // Set results
    const results = searchNewsArticlesData.data.searchNewsArticles

    if (newsArticles == null) {
      setNewsArticles(results.newsArticles)
    } else {
      setNewsArticles(newsArticles.concat(results.newsArticles))
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
      await getNewsArticles()
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
