import {  Autocomplete, Chip, TextField } from '@mui/material'

interface Props {
  freeSolo: boolean
  values: any[]
  setValues: any
  options: any[]
  style: any
}

export default function MultiTags({
                          freeSolo,
                          values,
                          setValues,
                          options,
                          style
                        }: Props) {

  // Render
  return (
    <div style={style}>

      <Autocomplete
        // defaultValue={}
        freeSolo={freeSolo}
        id='tags-filled'
        multiple
        options={options}
        onChange={(event, newValue, reason, details) => {

          if (details) {
            let valueList = values

            if (details.option.create && reason !== 'removeOption') {
              valueList.push({
                id: undefined,
                name: details.option.name,
                create: details.option.create
              })

              setValues(valueList)
            }
            else {
              setValues(newValue)
            }
          }
        }}
        renderTags={(value: readonly string[], getTagProps) =>
          value.map((option: string, index: number) => {
            const { key, ...tagProps } = getTagProps({ index });
            return (
              <Chip variant='outlined' label={option} key={key} {...tagProps} />
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label='Tags'
            // placeholder=''
          />
        )}
        value={values}
      />

    </div>
  )
}
