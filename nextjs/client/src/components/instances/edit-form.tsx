import { useEffect, useState } from 'react'
import { Alert, Button, TextField, Typography } from '@mui/material'
import { autoFocusInputProps } from '@/serene-core-client/components/basics/mui-auto-focus'
import { BaseDataTypes } from '../../types/base-data-types'
import SaveInstance from './save'
import GeoLocationAutoComplete from '../geo-location/auto-complete'

interface Props {
  instance: any
  userProfileId: string
  options: any
}

export default function EditInstanceForm({
                          instance,
                          userProfileId,
                          options
                        }: Props) {

  // State
  const [status, setStatus] = useState<boolean | undefined>(undefined)
  const [alertSeverity, setAlertSeverity] = useState<any>('')
  const [message, setMessage] = useState<string | undefined>(undefined)
  const [save, setSave] = useState<boolean>(false)
  const [name, setName] = useState(instance.name)
  // const [country, setCountry] = useState(`${instance.legalGeo.emoji} ${instance.legalGeo.name}`)
  const [country, setCountry] = useState(`${instance.legalGeo.name}`)
  const [legalGeoId, setLegalGeoId] = useState(instance.legalGeo.id)

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

        <Typography
          style={{ marginBottom: '1em' }}
          variant='body1'>
          Country: {instance.legalGeo.emoji} {instance.legalGeo.name}
        </Typography>

        <GeoLocationAutoComplete
          label='New country'
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
        Save
      </Button>

      <SaveInstance
        instanceId={instance.id}
        userProfileId={userProfileId}
        status={BaseDataTypes.activeStatus}
        name={name}
        legalGeoId={legalGeoId != null && legalGeoId.trim() !== '' ? legalGeoId : instance.legalGeo.id}
        save={save}
        setSave={setSave}
        setStatus={setStatus}
        setAlertSeverity={setAlertSeverity}
        setMessage={setMessage} />
    </>
  )
}
