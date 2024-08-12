import Head from 'next/head'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { ClientOnlyTypes } from '@/types/client-only-types'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout, { pageBodyWidth } from '@/components/layout/full-height-layout'
import LoadInstanceById from '@/components/instances/load-by-id'
import ViewInstanceHeader from '@/components/instances/view-header'
import LoadIssuesBySearch from '@/components/issues/search/load-by-search'
import ListIssuesSearchResults from '@/components/issues/search/list-results'
import SearchInputBar from '@/components/kb/search/search-input-bar'

interface Props {
  instanceId: string
  userProfile: any
}

export default function SearchIssuesPage({
                          instanceId,
                          userProfile
                        }: Props) {

  // URL parameters
  const searchParams = useSearchParams()
  const inputParam = searchParams.get('input')
  const input = inputParam != null ? inputParam : ''

  // State
  const [instance, setInstance] = useState(undefined)
  const [issues, setIssues] = useState<any[] | undefined>(undefined)
  const [page, setPage] = useState<number>(0)
  const [refresh, setRefresh] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(false)
  const [newInput, setNewInput] = useState<string>(input != null ? input : '')

  // Functions
  async function loadMore(nextPage: number) {

    const fnName = `loadMore()`
    // console.log(`${fnName}: isLoading: ${isLoading}`)

    if (isLoading === true ||
        hasMore === false) {
      return
    }

    // console.log(`${fnName}: page: ${page}`)
    // console.log(`${fnName}: nextPage: ${nextPage}`)
    // console.log(`${fnName}: hasMore: ${hasMore}`)

    setIsLoading(true)

    // Inc the page (workaround nextPage sometimes skipping pages)
    // setPage(nextPage)
    setPage(page + 1)

    setRefresh(true)
  }

  // Render
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - Issues search</title>
      </Head>

      <LoadInstanceById
        id={instanceId}
        userProfileId={userProfile.id}
        setInstance={setInstance}
        includeStats={false} />

      <Layout userProfileId={userProfile.id}>
        <div style={{ margin: '0 auto', width: pageBodyWidth, verticalAlign: 'textTop' }}>

          {instance != null ?
            <ViewInstanceHeader
              instance={instance}
              topBarTab={ClientOnlyTypes.issuesTopMenuTab} />
          :
            <>Loading..</>
          }

          <SearchInputBar
            newInput={newInput}
            setNewInput={setNewInput}
            url={undefined} />

          <LoadIssuesBySearch
            instanceId={instanceId}
            userProfileId={userProfile.id}
            input={input}
            issues={issues}
            setIssues={setIssues}
            page={page}
            refresh={refresh}
            setRefresh={setRefresh}
            setIsLoading={setIsLoading}
            setHasMore={setHasMore} />

          {issues != null ?
            <InfiniteScroll
              pageStart={0}
              loadMore={loadMore}
              hasMore={hasMore}
              loader={<div className='loader' key={0}>Loading ...</div>}>

              <ListIssuesSearchResults
                issues={issues} />
            </InfiniteScroll>
          :
            <>Searching..</>
          }
        </div>
      </Layout>
    </>
  )
}

export async function getServerSideProps(context: any) {

  return loadServerPage(
           context,
           false,  // loadChat
           false)  // verifyLoggedInUsersOnly
}
