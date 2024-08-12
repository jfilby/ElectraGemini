import Head from 'next/head'
import { Button, Typography } from '@mui/material'
import { loadServerPage } from '@/services/page/load-server-page'
import FullHeightLayout, { pageBodyWidth } from '@/components/layout/full-height-layout'
import MoreInformation from '@/components/layout/more-information'

interface Props {
  userProfile: any
}

export default function LandingPage({
                          userProfile
                        }: Props) {

  // Render
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME}</title>
      </Head>

      <FullHeightLayout userProfileId={userProfile.id}>
        <div style={{ margin: '0 auto', width: pageBodyWidth, verticalAlign: 'textTop' }}>
          <h1>Electra AI</h1>
          <Typography variant='body1' style={{ marginBottom: '2em' }}>
            {process.env.NEXT_PUBLIC_TAG_LINE}
          </Typography>

          <div style={{ marginBottom: '2em' }}>
            <h1>Developed for {process.env.NEXT_PUBLIC_DEVELOPED_FOR}</h1>

            <Button
              onClick={(e: any) => window.location.href = `/instances/demos`}
              variant='contained'>
              Demo instances
            </Button>

            <Button
              style={{ marginLeft: '1em' }}
              onClick={(e: any) => window.location.href = `/instances`}
              variant='outlined'>
              For my organization
            </Button>
          </div>

          <div style={{ marginBottom: '5em' }} />

          <h1>Benefits</h1>
          <ul>
            <li>
              <Typography variant='body1'>
                Powered by {process.env.NEXT_PUBLIC_POWERED_BY}.
              </Typography>
            </li>
            <li>
              <Typography variant='body1'>
                Knowledge base with a starter folder template.
              </Typography>
            </li>
            <li>
              <Typography variant='body1'>
                Generates issues from news headlines/content.
              </Typography>
            </li>
            <li>
              <Typography variant='body1'>
                Generates proposals as potential solutions to issues.
              </Typography>
            </li>
            <li>
              <Typography variant='body1'>
                Users can vote on proposals, which are pushed to the blockchain.
              </Typography>
            </li>
          </ul>

          <div style={{ marginBottom: '5em' }} />

          <h1>Future benefits</h1>
          <ul>
            <li>
              <Typography variant='body1'>
                Ability to support at any level of an organization, based on your preferences.
              </Typography>
            </li>
            <li>
              <Typography variant='body1'>
                Broad AI and other systems support, via APIs.
              </Typography>
            </li>
            <li>
              <Typography variant='body1'>
                Chats with your team and other groups in your organization.
              </Typography>
            </li>
            <li>
              <Typography variant='body1'>
                Chats with relevant external groups.
              </Typography>
            </li>
            <li>
              <Typography variant='body1'>
                Verify votes independently from this platform.
              </Typography>
            </li>
          </ul>

        </div>
        {/* <MoreInformation /> */}
      </FullHeightLayout>
    </>
  )
}

export async function getServerSideProps(context: any) {

  return loadServerPage(context)
}
