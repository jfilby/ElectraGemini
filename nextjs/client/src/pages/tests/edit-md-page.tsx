import { useState } from 'react'
import { loadServerPage } from '@/services/page/load-server-page'
import FullHeightLayout from '@/components/layout/full-height-layout'
import EditMarkdownContent from '@/components/kb/markdown/edit'
import { Divider } from '@mui/material'
import ViewMarkdownContent from '@/components/kb/markdown/view'

interface Props {
  // signedIn: string
  userProfile: any
}

export default function EditMarkdownPage({
                          // signedIn,
                          userProfile
                        }: Props) {

  // Consts
  const initialContent = '# Hi'

  // State
  const [kbFile, setKbFile] = useState({})
  const [contents, setContents] = useState(initialContent)

  // Functions
  async function setKbFileContents(e: any) {
    setContents(e.value)
  }

  // Render
  return (
    <>
      <FullHeightLayout userProfileId={userProfile.id}>

        <EditMarkdownContent
          kbFile={kbFile}
          text={contents}
          setText={setContents} />

        <Divider />

        <p>{contents}</p>

        <Divider />

        <ViewMarkdownContent
          text={initialContent} />

      </FullHeightLayout>
    </>
  )
}

export async function getServerSideProps(context: any) {

  return loadServerPage(
           context,
           false,  // loadChat
           true)   // verifyLoggedInUsersOnly
}
