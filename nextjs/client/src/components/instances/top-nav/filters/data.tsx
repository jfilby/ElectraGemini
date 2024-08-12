import React from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

export default function DataNavFilters() {

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
            <MenuItem value='analytics'>Analytics</MenuItem>
            <MenuItem value='apis'>APIs</MenuItem>
            <MenuItem value='entities'>Entities</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div style={{ display: 'inline-block', marginLeft: '1em', width: '10em' }}>
        <FormControl fullWidth>
          <InputLabel id='select-label-1'>Name</InputLabel>
          <Select
            label='Timeline type'
            value='all'>
            <MenuItem value='all'>All</MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  )
}
