import { useEffect, useState } from 'react'
import { Alert, Button, TextField } from '@mui/material'
import { autoFocusInputProps } from '@/serene-core-client/components/basics/mui-auto-focus'
import { BaseDataTypes } from '../../types/base-data-types'
import SaveInstance from './save'
import GeoLocationAutoComplete from '../geo-location/auto-complete'

interface Props {
  userProfileId: string
  options: any
}

export default function AddInstanceForm({
                          userProfileId,
                          options
                        }: Props) {

  // State
  const [status, setStatus] = useState<boolean | undefined>(undefined)
  const [alertSeverity, setAlertSeverity] = useState<any>('')
  const [message, setMessage] = useState<string | undefined>(undefined)
  const [save, setSave] = useState<boolean>(false)
  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [legalGeoId, setLegalGeoId] = useState('')

  // Effects
  useEffect(() => {

    // Only proceed if status is true
    if (status !== true) {
      return
    }

    // Save successful
    window.location.href = `/instances`

  }, [status])

  // Render
  return (
    <>
      {message != null ?
        <Alert
          severity={alertSeverity}
          style={{ marginBottom: '2em' }}>
          {message}
        </Alert>
      :
        <></>
      }

      <div style={{ marginBottom: '2em' }}>

        <TextField
          label='Name'
          onChange={(e) => { setName(e.target.value) }}
          style={{ marginBottom: '2em' }}
          value={name}
          // InputProps={autoFocusInputProps()}
          />

        {/* <p>country: {JSON.stringify(country)}</p>
        <p>legalGeoId: {JSON.stringify(legalGeoId)}</p> */}

        <GeoLocationAutoComplete
          label='Country'
          setId={setLegalGeoId}
          value={country}
          setValue={setCountry}
          options={options.countries}
          style={undefined} />
      </div>

      <Button
        onClick={(e) => {
          setSave(true)
        }}
        variant='contained'>
        Add
      </Button>

      <SaveInstance
        instanceId={undefined}
        userProfileId={userProfileId}
        status={BaseDataTypes.activeStatus}
        name={name}
        legalGeoId={legalGeoId}
        save={save}
        setSave={setSave}
        setStatus={setStatus}
        setAlertSeverity={setAlertSeverity}
        setMessage={setMessage} />
    </>
  )
}
