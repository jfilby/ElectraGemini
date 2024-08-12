import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { getKbFileByIdQuery } from '@/apollo/kb'

interface Props {
  // signedIn: string
  id: string | undefined
  instanceId: string,
  userProfileId: string
  setKbFile: any
  setKbFolderBreadcrumbs: any
  setKbFileContent: any
  setKbFolderFiles: any
  refresh: boolean
  setRefresh: any
}

export default function LoadKbFileById({
                          // signedIn,
                          id,
                          instanceId,
                          userProfileId,
                          setKbFile,
                          setKbFolderBreadcrumbs,
                          setKbFileContent,
                          setKbFolderFiles,
                          refresh,
                          setRefresh
                        }: Props) {

  // GraphQL
  const [fetchGetKbFileByIdQuery] =
    useLazyQuery(getKbFileByIdQuery, {
      fetchPolicy: 'no-cache'
      /* onCompleted: data => {
        console.log('elementName: ' + elementName)
        console.log(data)
      },
      onError: error => {
        console.log(error)
      } */
    })

  // Functions
  async function getKbFile() {

    // Query
    const getKbFileByIdData =
      await fetchGetKbFileByIdQuery(
        {
          variables: {
            id: id,
            instanceId: instanceId,
            userProfileId: userProfileId,
            includeAcl: true,
            includeContents: true,
            includeFolderFiles: true,
            includeFolderBreadcrumbs: true
          }
        })

    // Set results
    const results = getKbFileByIdData.data.kbFileById

    setKbFile(results.kbFile)
    setKbFolderBreadcrumbs(results.folderBreadcrumbs)
    setKbFileContent(results.kbFileContent)
    setKbFolderFiles(results.folderFiles)
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {
      await getKbFile()
    }

    // Only proceed if refresh is true
    if (refresh === false) {
      return
    } else {
      setRefresh(false)
    }

    // Async call
    const result = fetchData()
      .catch(console.error)

  }, [refresh])

  // Render
  return (
    <></>
  )
}
