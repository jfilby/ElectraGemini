import { Typography } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

interface Props {
  open: boolean
  setOpen: any
  setDeleteConfirmed: any
}

export default function DeleteKbFilesDialog({
                          open,
                          setOpen,
                          setDeleteConfirmed
                        }: Props) {

  // Functions
  const handleYes = () => {
    setDeleteConfirmed(true)
    setOpen(false)
  }

  const handleNo = () => {
    setDeleteConfirmed(false)
    setOpen(false)
  }

  // Render
  return (
    <Dialog
      open={open}
      onClose={handleNo}
      aria-labelledby='delete-entries-dialog-title'
      aria-describedby='delete-entries-dialog-description'>
      <DialogTitle id='delete-entries-dialog-title'>
        Delete files/folders
      </DialogTitle>
      <DialogContent>

        <div style={{ marginBottom: '1em' }}>
          <Typography variant='body1'>
            Are you sure? This action cannot be undone.
          </Typography>
        </div>

      </DialogContent>
      <DialogActions>
        <Button variant='outlined' onClick={handleYes} autoFocus>Yes</Button>
        <Button variant='contained' onClick={handleNo} autoFocus>No</Button>
      </DialogActions>
    </Dialog>
  )
}
