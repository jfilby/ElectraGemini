import Head from 'next/head'
import { useState } from 'react'
import { ClientOnlyTypes } from '@/types/client-only-types'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout, { pageBodyWidth } from '@/components/layout/full-height-layout'
import LoadInstanceById from '@/components/instances/load-by-id'
import ViewInstanceHeader from '@/components/instances/view-header'
import AddProposalForm from '@/components/proposals/add-form'

interface Props {
  instanceId: string
  userProfile: any
  issueId: string
}

export default function AddProposalPage({
                          instanceId,
                          userProfile,
                          issueId
                        }: Props) {

  // State
  const [instance, setInstance] = useState<any>(undefined)

  // Render
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - Add a proposal for an issue</title>
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

          <h2>Add a new proposal</h2>

          <AddProposalForm
            instanceId={instanceId}
            userProfileId={userProfile.id}
            issueId={issueId} />
        </div>
      </Layout>
    </>
  )
}

export async function getServerSideProps(context: any) {

  return loadServerPage(
           context,
           false,  // loadChat
           true)   // verifyLoggedInUsersOnly
}
