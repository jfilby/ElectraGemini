import { useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { upsertInstanceMutation } from '../../apollo/instances'

interface Props {
  instanceId: string | undefined
  userProfileId: string
  status: string
  name: string | undefined
  legalGeoId: string | undefined
  save: boolean
  setSave: any
  setStatus: any
  setAlertSeverity: any
  setMessage: any
}

export default function SaveInstance({
                          instanceId,
                          userProfileId,
                          status,
                          name,
                          legalGeoId,
                          save,
                          setSave,
                          setStatus,
                          setAlertSeverity,
                          setMessage
                        }: Props) {

  // GraphQL
  const [sendUpsertInstanceMutation] =
    useMutation(upsertInstanceMutation, {
      fetchPolicy: 'no-cache'
      /* onCompleted: data => {
        console.log('elementName: ' + elementName)
        console.log(data)
      },
      onError: error => {
        console.log(error)
      } */
    })

  // Functions
  async function upsertInstance() {

    // Debug
    const fnName = `upsertInstance()`

    // Query
    const upsertInstanceData =
      await sendUpsertInstanceMutation(
        {
          variables: {
            id: instanceId,
            userProfileId: userProfileId,
            legalGeoId: legalGeoId,
            status: status,
            name: name
          }
        })

    // Set results
    const results = upsertInstanceData.data.upsertInstance

    if (results.status === true) {
      setAlertSeverity('success')
    } else {
      setAlertSeverity('error')
    }

    setStatus(results.status)
    setMessage(results.message)
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {
      await upsertInstance()
    }

    // Only proceed if refresh is true
    if (save === false) {
      return
    } else {
      setSave(false)
    }

    // Async call
    const result = fetchData()
      .catch(console.error)

  }, [save])

  // Render
  return (
    <></>
  )
}
