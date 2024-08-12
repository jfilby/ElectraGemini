import React from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

export default function ChatsNavFilters() {

  // Render
  return (
    <div style={{ marginBottom: '2em' }}>
      <div style={{ display: 'inline-block', width: '10em' }}>
        <FormControl fullWidth>
          <InputLabel id='select-label-1'>For</InputLabel>
          <Select
            label='For'
            value='all'>
            <MenuItem value='all'>All</MenuItem>
            <MenuItem value='internal'>Internal</MenuItem>
            <MenuItem value='thePublic'>The public</MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  )
}
