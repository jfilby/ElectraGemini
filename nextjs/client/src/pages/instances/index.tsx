import Head from 'next/head'
import { Button, Typography } from '@mui/material'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout, { pageBodyWidth } from '@/components/layout/full-height-layout'
import ListInstances from '@/components/instances/list'
import { BaseDataTypes } from '@/types/base-data-types'

interface Props {
  userProfile: any
}

export default function ListInstancesPage({
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

          <div style={{ width: '100%' }}>
            <div style={{ display: 'inline-block', width: '50%' }}>
              <Typography variant='h3'>
                My list of instances
              </Typography>
            </div>
            <div style={{ display: 'inline-block', textAlign: 'right', width: '50%' }}>
              <Button
                onClick={(e) => window.location.href = `/instances/add` }
                variant='outlined'>
                Add
              </Button>
            </div>
          </div>

          <ListInstances
            orgType={undefined}
            instanceType={BaseDataTypes.realInstanceType}
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
           true)   // verifyLoggedInUsersOnly
}
