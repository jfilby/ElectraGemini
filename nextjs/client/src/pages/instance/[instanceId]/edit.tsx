import Head from 'next/head'
import { useState } from 'react'
import { Typography } from '@mui/material'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout, { pageBodyWidth } from '@/components/layout/full-height-layout'
import EditInstanceForm from '@/components/instances/edit-form'
import LoadInstanceOptions from '@/components/instances/load-options'
import LoadInstanceById from '@/components/instances/load-by-id'

interface Props {
  instanceId: string
  userProfile: any
}

export default function EditInstancePage({
                          instanceId,
                          userProfile
                        }: Props) {

  // State
  const [instance, setInstance] = useState<any>(undefined)
  const [options, setOptions] = useState<any>(undefined)

  // Render
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - Edit instance</title>
      </Head>

      <LoadInstanceOptions
        userProfileId={userProfile.id}
        setOptions={setOptions} />

      <Layout userProfileId={userProfile.id}>
        <div style={{ margin: '0 auto', width: pageBodyWidth, verticalAlign: 'textTop' }}>

          {/* <p>options: {JSON.stringify(options)}</p> */}

          <Typography
            style={{ marginBottom: '1em' }}
            variant='h3'>
            Edit an instance
          </Typography>

          {instance != null &&
           options != null ?
            <EditInstanceForm
              instance={instance}
              userProfileId={userProfile.id}
              options={options} />
          :
            <></>
          }

          <LoadInstanceById
            id={instanceId}
            userProfileId={userProfile.id}
            setInstance={setInstance}
            includeStats={false} />
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
