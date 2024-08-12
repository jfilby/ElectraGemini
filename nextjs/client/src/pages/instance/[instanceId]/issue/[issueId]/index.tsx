import Head from 'next/head'
import { useState } from 'react'
import { ClientOnlyTypes } from '@/types/client-only-types'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout, { pageBodyWidth } from '@/components/layout/full-height-layout'
import { Link, Typography } from '@mui/material'
import LoadInstanceById from '@/components/instances/load-by-id'
import ViewInstanceHeader from '@/components/instances/view-header'
import LoadIssueById from '@/components/issues/load-by-id'
import ViewFileOrFolder from '@/components/kb/view-file-or-folder'
import ListProposals from '@/components/proposals/list'
import IssueTags from '@/components/issues/tags'
import ListNewsArticles from '@/components/news-articles/list'
import LoadNewsArticlesBySearch from '@/components/news-articles/load-by-search'

interface Props {
  instanceId: string
  userProfile: any
  issueId: string
}

export default function ViewIssuesPage({
                          instanceId,
                          userProfile,
                          issueId
                        }: Props) {

  // State
  const [instance, setInstance] = useState<any>(undefined)
  const [issue, setIssue] = useState<any | undefined>(undefined)
  const [kbFileContent, setKbFileContent] = useState<string | undefined>(undefined)
  const [proposals, setProposals] = useState<any[] | undefined>(undefined)
  const [newsArticles, setNewsArticles] = useState<any[] | undefined>(undefined)
  const [issueRefresh, setIssueRefresh] = useState<boolean>(true)
  const [newsArticlesRefresh, setNewsArticlesRefresh] = useState<boolean>(true)
  const [newsArticlesIsLoading, setNewsArticlesIsLoading] = useState<boolean>(true)
  const [newsArticlesHasMore, setNewsArticlesHasMore] = useState<boolean>(true)

  // Render
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - Issues</title>
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

          <LoadIssueById
            instanceId={instanceId}
            userProfileId={userProfile.id}
            issueId={issueId}
            setIssue={setIssue}
            setKbFileContent={setKbFileContent}
            setProposals={setProposals}
            refresh={issueRefresh}
            setRefresh={setIssueRefresh} />

          {/* <p>issueId: {JSON.stringify(issueId)}</p> */}
          {/* <p>issue: {JSON.stringify(issue)}</p> */}

          <div style={{ marginBottom: '1em' }}>

            <Typography
              id='issue'
              variant='h4'
              style={{ marginBottom: '0.5em' }}>
              Issue
            </Typography>

            {issue != null ?
              <IssueTags
                instanceId={issue.instanceId}
                tags={issue.tags} />
            :
              <></>
            }

            <Link
              href='#proposals'
                style={{ display: 'inline-block' }}>
              <Typography variant='body1'>
                View proposals
              </Typography>
            </Link>

            <Link
              href='#related-news'
              style={{ marginLeft: '2em', display: 'inline-block' }}>
              <Typography variant='body1'>
                Related news
              </Typography>
            </Link>

            <Link
              href={`/instance/${instanceId}/chats?issueId=${issueId}`}
              style={{ marginLeft: '2em', display: 'inline-block' }}>
              <Typography variant='body1'>
                Chat about this issue
              </Typography>
            </Link>

            <Link
              href={`/instance/${instanceId}/issues`}
              style={{ marginLeft: '2em', display: 'inline-block' }}>
              <Typography variant='body1'>
                Back to issues
              </Typography>
            </Link>
          </div>

          {issue != null ?
            <div style={{ marginBottom: '2em' }}>
              {issue.kbFile != null ?
                <ViewFileOrFolder
                  instanceId={instanceId}
                  kbFile={issue.kbFile}
                  kbFolderBreadcrumbs={undefined}
                  kbFileContent={kbFileContent}
                  setKbFileContent={setKbFileContent}
                  folderFiles={[]}
                  userProfileId={userProfile.id}
                  setRefresh={setIssueRefresh} />
              :
                <></>
              }
            </div>
          :
            <></>
          }

          <div style={{ marginBottom: '1em' }}>
            <div style={{ display: 'inline-block', width: '50%' }}>
              <Typography
                id='proposals'  // For anchor link
                variant='h4'>
                Proposals
              </Typography>
            </div>

            {/* <div style={{ display: 'inline-block', textAlign: 'right', width: '50%' }}>
              <Button
                onClick={(e) => {
                  window.location.href =
                    `/instance/${instanceId}/issue/${issueId}/proposals/add`
                }}
                variant='contained'>
                Add
              </Button>
            </div> */}
          </div>

          {proposals != null ?
            <ListProposals
              instanceId={instanceId}
              tag={null}
              proposals={proposals}
              withIssues={false} />
          :
            <></>
          }

          {issue != null ?
            <LoadNewsArticlesBySearch
                instanceId={instanceId}
                userProfileId={userProfile.id}
                page={0}
                issueId={issueId}
                input={issue.kbFile.name}
                newsArticles={newsArticles}
                setNewsArticles={setNewsArticles}
                refresh={newsArticlesRefresh}
                setRefresh={setNewsArticlesRefresh}
                setIsLoading={setNewsArticlesIsLoading}
                setHasMore={setNewsArticlesHasMore} />
          :
            <></>
          }

          <div style={{ marginBottom: '2em' }}></div>

          <div style={{ marginBottom: '1em' }}>
            <div style={{ display: 'inline-block', marginBottom: '1em', width: '50%' }}>
              <Typography
                id='related-news'  // For anchor link
                variant='h4'>
                Related news articles
              </Typography>
            </div>

            {newsArticles != null ?
              <ListNewsArticles
                newsArticles={newsArticles} />
            :
              <></>
            }
          </div>

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
