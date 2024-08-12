import Head from 'next/head'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { loadServerPage } from '@/services/page/load-server-page'
import { ClientOnlyTypes } from '@/types/client-only-types'
import Layout, { pageBodyWidth } from '@/components/layout/full-height-layout'
import LoadInstanceById from '@/components/instances/load-by-id'
import ViewInstanceHeader from '@/components/instances/view-header'
import LoadProposalsByFilter from '@/components/proposals/load-by-filter'
import { Typography } from '@mui/material'
import ListProposals from '@/components/proposals/list'
import SearchInputBar from '@/components/kb/search/search-input-bar'

interface Props {
  instanceId: string
  userProfile: any
}

export default function ViewProposalsPage({
                          instanceId,
                          userProfile
                        }: Props) {

  // State
  const [instance, setInstance] = useState<any>(undefined)
  const [proposals, setProposals] = useState<any[] | undefined>(undefined)
  const [page, setPage] = useState<number>(0)
  const [refresh, setRefresh] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(false)
  const [newInput, setNewInput] = useState('')

  const searchParams = useSearchParams()
  const tag = searchParams.get('tag')

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
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - Proposals</title>
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
              topBarTab={ClientOnlyTypes.proposalsTopMenuTab} />
          :
            <>Loading..</>
          }

          <SearchInputBar
            newInput={newInput}
            setNewInput={setNewInput}
            url={`/instance/${instanceId}/proposals/search`} />

          {searchParams != null ?
            <LoadProposalsByFilter
              instanceId={instanceId}
              userProfileId={userProfile.id}
              tag={tag}
              page={page}
              issueId={undefined}
              includeIssues={true}
              proposals={proposals}
              setProposals={setProposals}
              refresh={refresh}
              setRefresh={setRefresh}
              setIsLoading={setIsLoading}
              setHasMore={setHasMore} />
          :
            <></>
          }

          {/* <p>proposals: {JSON.stringify(proposals)}</p> */}

          <div style={{ marginBottom: '1em' }}>
            <div style={{ display: 'inline-block', width: '50%' }}>
              <Typography
                id='proposals'
                variant='h4'>
                Proposals
              </Typography>
            </div>

            <div style={{ display: 'inline-block', width: '50%', textAlign: 'right' }}>
              <Typography variant='body1'>
                Proposals are added to specific issues.
              </Typography>
            </div>
          </div>

          {searchParams != null &&
           proposals != null ?

            <InfiniteScroll
              pageStart={0}
              loadMore={loadMore}
              hasMore={hasMore}
              loader={<div className='loader' key={0}>Loading ...</div>}>

             <ListProposals
                instanceId={instanceId}
                tag={tag}
                proposals={proposals}
                withIssues={true} />
            </InfiniteScroll>
          :
            <></>
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
