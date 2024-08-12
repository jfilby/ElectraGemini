import { Autocomplete, createFilterOptions, TextField } from '@mui/material'

interface Props {
  label: string
  setId: any
  value: string
  setValue: any
  options: any[]
  style: any
}

export default function GeoLocationAutoComplete({
                          label,
                          setId,
                          value,
                          setValue,
                          options,
                          style
                        }: Props) {

  const filter = createFilterOptions()

  // Render
  return (
    <div style={style}>

      <Autocomplete
        blurOnSelect
        disableCloseOnSelect
        filterSelectedOptions
        filterOptions={(options, params) => {
          return filter(options, params)
        }}
        id='geo-location'
        inputValue={value}
        isOptionEqualToValue={(option, value) => option.name === value.name}
        getOptionLabel={(option) => option.name}
        options={options}
        onInputChange={(event, newInputValue) => {
          setValue(newInputValue)

          var id = ''

          for (const option of options) {
            if (option.name === newInputValue) {
              id = option.id
              break
            }
          }

          setId(id)
        }}
        onChange={(e: any, newValue: any | null, reason, details) => {

          if (reason === 'clear') {
            setId('')
            setValue('')
            return
          }

          if (newValue != null) {
            setId(newValue.id)
            setValue(newValue.name)
          } else {
            setId(null)
            setValue(null)
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label} />
        )}
      />

    </div>
  )
}
