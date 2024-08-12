import Head from 'next/head'
import { useState } from 'react'
import { Typography } from '@mui/material'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout, { pageBodyWidth } from '@/components/layout/full-height-layout'
import AddInstanceForm from '@/components/instances/add-form'
import LoadInstanceOptions from '@/components/instances/load-options'

interface Props {
  userProfile: any
}

export default function AddInstancePage({
                          userProfile
                        }: Props) {

  // State
  const [options, setOptions] = useState<any>(undefined)

  // Render
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - Add instance</title>
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
            Add a new instance
          </Typography>

          {options != null ?
            <AddInstanceForm
              userProfileId={userProfile.id}
              options={options} />
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
           true)   // verifyLoggedInUsersOnly
}
