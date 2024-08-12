import { useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { upsertIssueMutation } from '../../apollo/issues'

interface Props {
  instanceId: string
  userProfileId: string
  id: string | undefined
  name: string
  save: boolean
  setSave: any
  setStatus: any
  setAlertSeverity: any
  setMessage: any
}

export default function SaveIssue({
                          instanceId,
                          userProfileId,
                          id,
                          name,
                          save,
                          setSave,
                          setStatus,
                          setAlertSeverity,
                          setMessage
                        }: Props) {

  // GraphQL
  const [sendUpsertIssueMutation] =
    useMutation(upsertIssueMutation, {
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
  async function upsertIssue() {

    // Debug
    const fnName = `upsertIssue()`

    // Query
    const upsertIssueData =
      await sendUpsertIssueMutation(
        {
          variables: {
            instanceId: instanceId,
            userProfileId: userProfileId,
            id: id,
            name: name
          }
        })

    // Set results
    const results = upsertIssueData.data.upsertIssue

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
      await upsertIssue()
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
