import Head from 'next/head'
import { useState } from 'react'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout, { pageBodyWidth } from '@/components/layout/full-height-layout'
import LoadInstanceById from '@/components/instances/load-by-id'
import ViewInstanceHeader from '@/components/instances/view-header'
import { Typography } from '@mui/material'

interface Props {
  instanceId: string
  userProfile: any
}

export default function ViewInstancePage({
                          instanceId,
                          userProfile
                        }: Props) {

  // State
  const [instance, setInstance] = useState<any>(undefined)

  // Render
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - Instance</title>
      </Head>

      <LoadInstanceById
        id={instanceId}
        userProfileId={userProfile.id}
        setInstance={setInstance}
        includeStats={true} />

      <Layout userProfileId={userProfile.id}>
        <div style={{ margin: '0 auto', width: pageBodyWidth, verticalAlign: 'textTop' }}>

          {instance != null ?
            <>
              <ViewInstanceHeader
                instance={instance}
                topBarTab={0} />

                <Typography
                  style={{ marginBottom: '1em' }}
                  variant='h4'>
                  Welcome!
                </Typography>
                <Typography
                  style={{ marginBottom: '2em' }}
                  variant='body1'>
                  This is the &quot;{instance.name}&quot; instance.<br/>
                  Country: {instance.legalGeo.emoji} {instance.legalGeo.name}<br/>
                  <br/>
                  There are {instance.stats.issuesCount} issues and {instance.stats.proposalsCount} proposals
                  to address them.
                </Typography>

                <Typography
                  style={{ marginBottom: '1em' }}
                  variant='h4'>
                  What&apos;s it about?
                </Typography>
                <Typography
                  style={{ marginBottom: '1em' }}
                  variant='body1'>
                  This is a political party instance where you can:
                </Typography>
                <ul>
                  <li>
                    <Typography variant='body1'>
                      Create issues that concern the {instance.legalGeo.legalGeoType.name.toLowerCase()}.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant='body1'>
                      Create proposals for each issue, and vote on them.
                    </Typography>
                  </li>
                </ul>

                <div style={{ marginBottom: '2em' }} />

                <Typography
                  style={{ marginBottom: '1em' }}
                  variant='h4'>
                  Where does AI come in?
                </Typography>
                <Typography
                  style={{ marginBottom: '1em' }}
                  variant='body1'>
                  This software is powered by {process.env.NEXT_PUBLIC_POWERED_BY}!<br/>
                  <br/>
                  This means that issues and proposals will automatically be generated
                  and updated for you on a daily basis using news headlines. {/* using a combination of: */}
                </Typography>
                {/* <ul>
                  <li>
                    <Typography variant='body1'>
                      News headlines sourced from newsapi.org.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant='body1'>
                      The documentation you create, including your Vision and values, Guidelines, etc.
                    </Typography>
                  </li>
                </ul> */}

                <div style={{ marginBottom: '2em' }} />

                <Typography
                  style={{ marginBottom: '1em' }}
                  variant='body1'>
                  You can also discuss issues and proposals with the AI. Click on Chat to discuss
                  anything, or go to a specific issue or proposal and click the `Chat about this` link.
                </Typography>
              </>
            :
            <>Loading..</>
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
