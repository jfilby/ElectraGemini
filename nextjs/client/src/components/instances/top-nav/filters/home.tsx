import React from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

export default function HomeNavFilters() {

  // Render
  return (
    <div style={{ marginBottom: '2em' }}>
      <div style={{ display: 'inline-block', width: '10em' }}>
        <FormControl fullWidth>
          <InputLabel id='select-label-1'>Source</InputLabel>
          <Select
            label='Source'
            value='all'>
            <MenuItem value='all'>All</MenuItem>
            <MenuItem value='updates'>Updates</MenuItem>
            <MenuItem value='news'>News</MenuItem>
            <MenuItem value='analytics'>Analytics</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div style={{ display: 'inline-block', marginLeft: '1em', width: '10em' }}>
        <FormControl fullWidth>
          <InputLabel id='select-label-1'>Timeline type</InputLabel>
          <Select
            label='Timeline type'
            value='all'>
            <MenuItem value='all'>All</MenuItem>
            <MenuItem value='onGoing'>On-going</MenuItem>
            <MenuItem value='campaign'>Campaigns</MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  )
}
