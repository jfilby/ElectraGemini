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
  setUndeleteConfirmed: any
}

export default function UndeleteInstanceDialog({
                          open,
                          name,
                          setOpen,
                          setUndeleteConfirmed
                        }: Props) {

  // Functions
  const handleYes = () => {
    setUndeleteConfirmed(true)
    setOpen(false)
  }

  const handleNo = () => {
    setUndeleteConfirmed(false)
    setOpen(false)
  }

  // Render
  return (
    <Dialog
      open={open}
      onClose={handleNo}
      aria-labelledby='undelete-entries-dialog-title'
      aria-describedby='undelete-entries-dialog-description'>
      <DialogTitle id='undelete-entries-dialog-title'>
        Delete {name}
      </DialogTitle>
      <DialogContent>

        <div style={{ marginBottom: '1em' }}>
          <Typography variant='body1'>
            Are you sure?
            This will undo the delete, as long as the delete hasn&apos;t yet
            gone into effect.
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
