import Head from 'next/head'
import { useState } from 'react'
import { ClientOnlyTypes } from '@/types/client-only-types'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout, { pageBodyWidth } from '@/components/layout/full-height-layout'
import { Link, Typography } from '@mui/material'
import LoadInstanceById from '@/components/instances/load-by-id'
import ViewInstanceHeader from '@/components/instances/view-header'
import LoadProposalById from '@/components/proposals/load-by-id'
import ViewFileOrFolder from '@/components/kb/view-file-or-folder'
import ViewIssueCard from '@/components/issues/cards/view'
import VotingCard from '@/components/voting/vote'
import ProposalTags from '@/components/proposals/tags'
import { BaseDataTypes } from '@/types/base-data-types'

interface Props {
  instanceId: string
  userProfile: any
  proposalId: string
}

export default function ViewProposalPage({
                          instanceId,
                          userProfile,
                          proposalId
                        }: Props) {

  // State
  const [instance, setInstance] = useState<any>(undefined)
  const [proposal, setProposal] = useState<any>(undefined)
  const [kbFileContent, setKbFileContent] = useState<string | undefined>(undefined)
  const [refresh, setRefresh] = useState<boolean>(true)

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
              topBarTab={ClientOnlyTypes.issuesTopMenuTab} />
          :
            <>Loading..</>
          }

          <LoadProposalById
            instanceId={instanceId}
            userProfileId={userProfile.id}
            proposalId={proposalId}
            setProposal={setProposal}
            setKbFileContent={setKbFileContent}
            refresh={refresh}
            setRefresh={setRefresh} />

          {/* <p>issueId: {JSON.stringify(issueId)}</p> */}
          {/* <p>issue: {JSON.stringify(proposal.issue)}</p> */}

          <div style={{ marginBottom: '1em' }}>

            <Typography
              id='proposal'
              variant='h4'
              style={{ marginBottom: '0.5em' }}>
              Proposal
            </Typography>

            {proposal != null ?
              <ProposalTags
                instanceId={proposal.instanceId}
                tags={proposal.tags} />
            :
              <></>
            }

            <Link
              href='#issue'
                style={{ display: 'inline-block' }}>
              <Typography variant='body1'>
                For issue
              </Typography>
            </Link>

            <Link
              href={`/instance/${instanceId}/chats?proposalId=${proposalId}`}
              style={{ marginLeft: '2em', display: 'inline-block' }}>
              <Typography variant='body1'>
                Chat about this proposal
              </Typography>
            </Link>

          </div>

          {proposal != null ?

            <div style={{ marginBottom: '2em' }}>

              <VotingCard
                instanceId={instanceId}
                refModel={BaseDataTypes.proposalModel}
                refId={proposal.id}
                userProfileId={userProfile.id} />

              {proposal.kbFile != null ?
                <ViewFileOrFolder
                  instanceId={instanceId}
                  kbFile={proposal.kbFile}
                  kbFolderBreadcrumbs={undefined}
                  kbFileContent={kbFileContent}
                  setKbFileContent={setKbFileContent}
                  folderFiles={[]}
                  userProfileId={userProfile.id}
                  setRefresh={setRefresh} />
              :
                <></>
              }
            </div>
          :
            <></>
          }

          <div>
            <div style={{ display: 'inline-block', width: '50%' }}>
              <Typography
                id='issue'
                variant='h4'>
                Issue
              </Typography>
            </div>
          </div>

          {proposal != null ?
            <ViewIssueCard
              issue={proposal.issue} />
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
