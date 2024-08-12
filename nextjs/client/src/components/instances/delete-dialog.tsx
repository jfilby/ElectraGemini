import { Typography } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

interface Props {
  open: boolean
  name: string
  setOpen: any
  setDeleteConfirmed: any
}

export default function DeleteInstanceDialog({
                          open,
                          name,
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
        Delete {name}
      </DialogTitle>
      <DialogContent>

        <div style={{ marginBottom: '1em' }}>
          <Typography variant='body1'>
            Are you sure?
            You will have a 24 hours to restore the instance before it gets
            permanently deleted.
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
