import Head from 'next/head'
import { useState } from 'react'
import { ClientOnlyTypes } from '@/types/client-only-types'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout, { pageBodyWidth } from '@/components/layout/full-height-layout'
import LoadInstanceById from '@/components/instances/load-by-id'
import LoadKbFileById from '@/components/kb/load-by-id'
import ViewInstanceHeader from '@/components/instances/view-header'
import ViewFileOrFolder from '@/components/kb/view-file-or-folder'
import SearchInputBar from '@/components/kb/search/search-input-bar'

interface Props {
  instanceId: string
  userProfile: any
}

export default function ViewDocumentsPage({
                          instanceId,
                          userProfile
                        }: Props) {

  // State
  const [instance, setInstance] = useState<any>(undefined)
  const [refresh, setRefresh] = useState<boolean>(true)
  const [kbFile, setKbFile] = useState<any>(undefined)
  const [kbFolderBreadcrumbs, setKbFolderBreadcrumbs] = useState<any>(undefined)
  const [kbFileContent, setKbFileContent] = useState<any>(undefined)
  const [kbFolderFiles, setKbFolderFiles] = useState<any>(undefined)
  const [newInput, setNewInput] = useState('')

  // Render
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - Documents</title>
      </Head>

      <LoadInstanceById
        id={instanceId}
        userProfileId={userProfile.id}
        setInstance={setInstance}
        includeStats={false} />

      <LoadKbFileById
        id={undefined}
        instanceId={instanceId}
        userProfileId={userProfile.id}
        setKbFile={setKbFile}
        setKbFolderBreadcrumbs={setKbFolderBreadcrumbs}
        setKbFileContent={setKbFileContent}
        setKbFolderFiles={setKbFolderFiles}
        refresh={refresh}
        setRefresh={setRefresh} />

      <Layout userProfileId={userProfile.id}>
        <div style={{ margin: '0 auto', width: pageBodyWidth, verticalAlign: 'textTop' }}>

          {instance != null ?
            <ViewInstanceHeader
              instance={instance}
              topBarTab={ClientOnlyTypes.documentsTopMenuTab} />
          :
            <>Loading..</>
          }

          <SearchInputBar
            newInput={newInput}
            setNewInput={setNewInput}
            url={`/instance/${instanceId}/documents/search`} />

          {kbFile != null ?
            <ViewFileOrFolder
              instanceId={instanceId}
              kbFile={kbFile}
              kbFolderBreadcrumbs={kbFolderBreadcrumbs}
              kbFileContent={''}
              setKbFileContent={undefined}
              folderFiles={kbFolderFiles}
              userProfileId={userProfile.id}
              setRefresh={setRefresh} />
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
