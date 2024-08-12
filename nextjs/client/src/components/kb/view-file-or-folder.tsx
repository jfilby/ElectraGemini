import ActionNotification from '@/serene-core-client/components/notifications/action'
import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { upsertKbFileMutation, upsertKbFileContentMutation, deleteKbFilesMutation } from '@/apollo/kb'
import { Button, Card, CardContent, Typography } from '@mui/material'
import { KbFileTypes } from '../../types/kb-file-types'
import DeleteKbFilesDialog from './delete-dialog'
import NewKbFileDialog from './new-file-dialog'
import ViewFolder from './view-folder'
import ViewFile from './view-file'
import KbFolderBreadcrumbs from './kb-folder-breadcrumbs'

interface Props {
  instanceId: string
  kbFile: any
  kbFolderBreadcrumbs: any
  kbFileContent: any
  setKbFileContent: any
  folderFiles: any[]
  userProfileId: string
  setRefresh: any
}

export default function ViewFileOrFolder({
                          instanceId,
                          kbFile,
                          kbFolderBreadcrumbs,
                          kbFileContent,
                          setKbFileContent,
                          folderFiles,
                          userProfileId,
                          setRefresh
                        }: Props) {

  // State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const [deleteConfirmed, setDeleteConfirmed] = useState(false)

  const [newDialogOpen, setNewDialogOpen] = useState(false)
  const [createNewFormat, setCreateNewFormat] = useState(KbFileTypes.directoryFormat)
  const [filename, setFilename] = useState('')

  const [editing, setEditing] = useState(false)

  const [alertSeverity, setAlertSeverity] = useState<any>(undefined)
  const [message, setMessage] = useState<string | undefined>(undefined)
  const [notificationOpened, setNotificationOpened] = useState<any>(false)

  // GraphQL
  const [sendDeleteKbFilesMutation] =
    useMutation(deleteKbFilesMutation, {
      /* onCompleted: data => {
        console.log(data)
      },
      onError: error => {
        console.log(error)
      } */
    })

  const [sendUpsertKbFileMutation] =
    useMutation(upsertKbFileMutation, {
      /* onCompleted: data => {
        console.log(data)
      },
      onError: error => {
        console.log(error)
      } */
    })

  const [sendUpsertKbFileContentMutation] =
    useMutation(upsertKbFileContentMutation, {
      /* onCompleted: data => {
        console.log(data)
      },
      onError: error => {
        console.log(error)
      } */
    })

  // Functions
  async function deleteKbFiles() {

    // GraphQL call
    var deleteKbFilesData: any

    await sendDeleteKbFilesMutation({
      variables: {
        kbFileIds: selected,
        instanceId: instanceId,
        userProfileId: userProfileId
      }
    }).then(result => deleteKbFilesData = result)

    // Handle results
    const results = deleteKbFilesData.data.deleteKbFiles

    if (results.status === false) {
      setAlertSeverity('error')
      setMessage(results.message)
    } else {
      // Success
      setAlertSeverity('success')
      setMessage(`Deleted successfully.`)

      // Refresh the parent component
      setSelected([])
      setRefresh(true)
    }
  }

  function discardChanges() {

    // window.location.href = `/instance/${instanceId}/document/${kbFile.id}`

    setEditing(false)
    // setContents(lastSavedContents)
  }

  async function newKbFile() {

    // Debug
    const fnName = `newKbFile()`

    // Validate
    if (createNewFormat == null) {
      console.error(`${fnName}: createNewFormat == null`)
      return
    }

    // Return if filename isn't set, this can happen when effects are changing
    if (filename == null ||
        filename === '') {

      return
    }

    // GraphQL call
    var upsertKbFileData: any

    await sendUpsertKbFileMutation({
      variables: {
        parentId: kbFile.id,
        instanceId: instanceId,
        publicAccess: null,
        format: createNewFormat,
        name: filename,
        userProfileId: userProfileId
      }
    }).then(result => upsertKbFileData = result)

    // Handle results
    const results = upsertKbFileData.data.upsertKbFile

    if (results.status === false) {
      setAlertSeverity('error')
      setMessage(results.message)
    } else {
      // Success
      setAlertSeverity('success')
      setMessage(`Created successfully.`)

      // Set the vars back to the defaults
      setCreateNewFormat(KbFileTypes.directoryFormat)
      setFilename('')

      // Refresh the parent component
      setRefresh(true)
    }
  }

  async function saveChanges() {

    // No changes
    if (kbFileContent == null) {
      return
    }

    // GraphQL call
    var upsertKbFileContentData: any

    await sendUpsertKbFileContentMutation({
      variables: {
        kbFileId: kbFile.id,
        instanceId: instanceId,
        text: kbFileContent.text,
        userProfileId: userProfileId
      }
    }).then(result => upsertKbFileContentData = result)

    // Handle results
    const results = upsertKbFileContentData.data.upsertKbFileContent

    if (results.status === false) {
      setAlertSeverity('error')
      setMessage(results.message)
    } else {
      // Success
      setNotificationOpened(true)
    }
  }

  async function switchToEditMode() {
    setEditing(true)
  }

  // Effects
  // Delete dialog
  useEffect(() => {

    const sendData = async () => {
      await deleteKbFiles()
    }

    // Only call after a valid selection from the dialog, which is now closed
    if (deleteConfirmed === true) {

      // Send data
      const result = sendData()
        .catch(console.error)
    }

    setDeleteConfirmed(false)

  }, [deleteConfirmed])

  // New dialog
  useEffect(() => {

    const sendData = async () => {
      await newKbFile()
    }

    // Only call after a valid selection from the dialog, which is now closed
    if (newDialogOpen === false &&
        createNewFormat != null) {

      // Send data
      const result = sendData()
        .catch(console.error)
    }

  }, [newDialogOpen])

  // Render
  return (
    <>
      {/* <p>kbFile: {JSON.stringify(kbFile)}</p>
      <p>kbFileContent: {JSON.stringify(kbFileContent)}</p>
      <p>folderFiles: {JSON.stringify(folderFiles)}</p>
      <p>selected: {JSON.stringify(selected)}</p> */}

      <Card>
        <CardContent>

          {kbFile != null ?
            <>
              <div style={{ marginBottom: '1em' }}>
                <div style={{ display: 'inline-block', width: '70%' }}>

                  {kbFolderBreadcrumbs != null ?
                    <KbFolderBreadcrumbs
                      instanceId={instanceId}
                      currentKbFile={kbFile}
                      kbFolderBreadcrumbs={kbFolderBreadcrumbs} />
                  :
                    <Typography
                      style={{ display: 'inline-block' }}
                      variant='h4'>
                      {kbFile.name}
                    </Typography>
                  }
                </div>

                <div style={{ float: 'right', display: 'inline-block' }}>
                  {kbFile.format === KbFileTypes.directoryFormat ?
                    <>
                      <Button
                        onClick={(e) => setNewDialogOpen(true)}
                        style={{ marginLeft: '0.5em' }}
                        variant='outlined'>
                        New
                      </Button>
                      <Button
                        onClick={(e) => setDeleteDialogOpen(true)}
                        style={{ marginLeft: '0.5em' }}
                        variant='outlined'>
                        Delete
                      </Button>
                    </>
                  :
                    <>
                      {KbFileTypes.textFileTypes.includes(kbFile.format) &&
                       kbFile.acl.write === true ?
                        <>
                          {editing === true ?
                            <>
                              <Button
                                onClick={(e) => saveChanges()}
                                variant='contained'>
                                Save
                              </Button>
                              <Button
                                onClick={(e) => discardChanges()}
                                style={{ marginLeft: '0.5em' }}
                                variant='outlined'>
                                Close
                              </Button>
                            </>
                          :
                            <Button
                              onClick={(e) => switchToEditMode()}
                              variant='contained'>
                              Edit
                            </Button>
                          }
                        </>
                      :
                        <></>
                      }
                    </>
                  }
                </div>
              </div>

              {kbFile.format === KbFileTypes.directoryFormat ?
                <ViewFolder
                  instanceId={instanceId}
                  folderFiles={folderFiles}
                  selected={selected}
                  setSelected={setSelected} />
              :
                <ViewFile
                  kbFile={kbFile}
                  kbFileContent={kbFileContent}
                  setKbFileContent={setKbFileContent}
                  editing={editing} />
              }
            </>
          :
            <></>
          }
        </CardContent>
      </Card>

      <ActionNotification
          message='Saved.'
          autoHideDuration={5000}
          notificationOpened={notificationOpened}
          setNotificationOpened={setNotificationOpened} />

      <DeleteKbFilesDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        setDeleteConfirmed={setDeleteConfirmed} />

      <NewKbFileDialog
        open={newDialogOpen}
        setOpen={setNewDialogOpen}
        createNewFormat={createNewFormat}
        setCreateNewFormat={setCreateNewFormat}
        filename={filename}
        setFilename={setFilename} />
    </>
  )
}
