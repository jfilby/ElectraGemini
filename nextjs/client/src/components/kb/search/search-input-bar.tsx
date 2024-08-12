import SearchIcon from '@mui/icons-material/Search'
import {  IconButton, TextField } from '@mui/material'

interface Props {
  newInput: string
  setNewInput: any
  url: string | undefined
}

export default function SearchInputBar({
                          newInput,
                          setNewInput,
                          url
                        }: Props) {

  // Functions
  function onSubmit(e: any) {

    if (url != null) {

      // Prevent the default form action
      e.preventDefault()

      // Set location
      window.location.href = `${url}?input=${newInput}`
    }
  }

  // Render
  return (
    <div style={{ marginBottom: '2em', width: '100%' }}>
      <form onSubmit={(e) => onSubmit(e)}>
        <TextField
          autoComplete='off'
          name='input'
          onChange={(e) => setNewInput(e.target.value)}
          placeholder='Search'
          style={{ width: '90%' }}
          value={newInput} />

        <IconButton
          style={{ marginLeft: '1em' }}
          type='submit'>
          <SearchIcon />
        </IconButton>
      </form>
    </div>
  )
}
