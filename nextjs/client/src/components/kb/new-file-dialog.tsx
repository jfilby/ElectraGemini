import { useState } from 'react'
import { Alert, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { KbFileTypes } from '../../types/kb-file-types'

interface Props {
  open: boolean
  setOpen: any
  createNewFormat: string | undefined
  setCreateNewFormat: any
  filename: string | undefined
  setFilename: any
}

export default function NewKbFileDialog({
                          open,
                          setOpen,
                          createNewFormat,
                          setCreateNewFormat,
                          filename,
                          setFilename
                        }: Props) {

  // State
  const [alertSeverity, setAlertSeverity] = useState<any>(undefined)
  const [message, setMessage] = useState<string | undefined>(undefined)

  // Functions
  const handleCreate = () => {

    // Validate
    if (createNewFormat == null ||
        createNewFormat.trim() == '') {

      setMessage('Select a file type')
      setAlertSeverity('error')

    } else if (filename == null ||
               filename.trim() == '') {

      setMessage('Specify a valid filename')
      setAlertSeverity('error')
    } else {
      // Validated OK
      setAlertSeverity(undefined)
      setMessage(undefined)

      // Set dialog to closed
      setOpen(false)
    }
  }

  const handleClose = () => {
    // Set back to defaults
    setCreateNewFormat(KbFileTypes.directoryFormat)
    setFilename('')

    setAlertSeverity(undefined)
    setMessage(undefined)

    // Close
    setOpen(false)
  }

  const handleRadioGroupChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCreateNewFormat((event.target as HTMLInputElement).value)
  }

  // Render
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='new-entry-dialog-title'
      aria-describedby='new-entry-dialog-description'>
      <DialogTitle id='new-entry-dialog-title'>
        New entry
      </DialogTitle>
      <DialogContent>

        {alertSeverity != null ?
          <div style={{ marginBottom: '1em' }}>
            <Alert
              severity={alertSeverity}
              variant='outlined'>
              <Typography fontWeight='lg' mt={0.25}>
                {message}
              </Typography>
            </Alert>
          </div>
        :
          <></>
        }

        <div style={{ marginBottom: '1em' }}>
          <FormControl>
            <FormLabel id='new-kbfile-type-group-label'>Which type do you want to create?</FormLabel>

            <RadioGroup
              aria-labelledby='new-kbfile-type-group-label'
              defaultValue={KbFileTypes.directoryFormat}
              name='new-kbfile-type-group'
              onChange={handleRadioGroupChange}
              value={createNewFormat}>

              <FormControlLabel
                value={KbFileTypes.directoryFormat}
                control={<Radio />} label='Folder' />

              <FormControlLabel
                value={KbFileTypes.textFormat}
                control={<Radio />} label='Text file' />
            </RadioGroup>
          </FormControl>
        </div>

        <div style={{ marginBottom: '1em' }}>
          <FormControl>
            <FormLabel id='new-kbfile-filename-group-label'>Filename</FormLabel>
            <TextField
              aria-labelledby='new-kbfile-filename-group-label'
              autoComplete='off'
              value={filename}
              onChange={(e) => setFilename(e.target.value)} />
          </FormControl>
        </div>

      </DialogContent>
      <DialogActions>
        <Button variant='outlined' onClick={handleClose} autoFocus>Cancel</Button>
        <Button variant='contained' onClick={handleCreate} autoFocus>Create</Button>
      </DialogActions>
    </Dialog>
  )
}
