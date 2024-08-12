import Head from 'next/head'
import { Typography } from '@mui/material'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout, { pageBodyWidth } from '@/components/layout/full-height-layout'
import ListInstances from '@/components/instances/list'
import { BaseDataTypes } from '@/types/base-data-types'

interface Props {
  userProfile: any
}

export default function ListDemoInstancesPage({
                          userProfile
                        }: Props) {

  // Render
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - List of instances</title>
      </Head>

      <Layout userProfileId={userProfile.id}>
        <div style={{ margin: '0 auto', width: pageBodyWidth, verticalAlign: 'textTop' }}>

          <Typography variant='h3'>
            Demo instances
          </Typography>

          <ListInstances
            orgType={undefined}
            instanceType={BaseDataTypes.demoInstanceType}
            parentId={undefined}
            status={undefined}
            userProfileId={userProfile.id} />

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
