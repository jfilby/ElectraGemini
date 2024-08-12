import { useEffect, useState } from 'react'
import { Alert, Button, TextField } from '@mui/material'
import { autoFocusInputProps } from '@/serene-core-client/components/basics/mui-auto-focus'
import SaveIssue from './save'

interface Props {
  instanceId: string
  userProfileId: string
}

export default function AddIssueForm({
                          instanceId,
                          userProfileId
                        }: Props) {

  // State
  const [status, setStatus] = useState<boolean | undefined>(undefined)
  const [alertSeverity, setAlertSeverity] = useState<any>('')
  const [message, setMessage] = useState<string | undefined>(undefined)
  const [save, setSave] = useState<boolean>(false)
  const [name, setName] = useState('')

  // Effects
  useEffect(() => {

    // Only proceed if status is true
    if (status !== true) {
      return
    }

    // Save successful
    window.location.href = `/instance/${instanceId}/issues`

  }, [status])

  // Render
  return (
    <>
      {message != null ?
        <Alert
          severity={alertSeverity}
          style={{ marginBottom: '2em' }}>
          {message}
        </Alert>
      :
        <></>
      }

      <TextField
        label='Name'
        onChange={(e) => { setName(e.target.value) }}
        style={{ marginBottom: '2em' }}
        value={name}
        InputProps={autoFocusInputProps()} />

      <br/>

      <Button
        onClick={(e) => {
          setSave(true)
        }}
        variant='contained'>
        Add
      </Button>

      <SaveIssue
        instanceId={instanceId}
        userProfileId={userProfileId}
        id={undefined}
        name={name}
        save={save}
        setSave={setSave}
        setStatus={setStatus}
        setAlertSeverity={setAlertSeverity}
        setMessage={setMessage} />
    </>
  )
}
