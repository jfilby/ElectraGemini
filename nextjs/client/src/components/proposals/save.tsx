import { useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { upsertProposalMutation } from '../../apollo/proposals'

interface Props {
  instanceId: string
  userProfileId: string
  issueId: string
  id: string | undefined
  name: string
  save: boolean
  setSave: any
  setStatus: any
  setAlertSeverity: any
  setMessage: any
}

export default function SaveProposal({
                          instanceId,
                          userProfileId,
                          issueId,
                          id,
                          name,
                          save,
                          setSave,
                          setStatus,
                          setAlertSeverity,
                          setMessage
                        }: Props) {

  // GraphQL
  const [sendUpsertProposalMutation] =
    useMutation(upsertProposalMutation, {
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
  async function upsertProposal() {

    // Debug
    const fnName = `upsertProposal()`

    // Query
    const upsertProposalData =
      await sendUpsertProposalMutation(
        {
          variables: {
            instanceId: instanceId,
            userProfileId: userProfileId,
            issueId: issueId,
            id: id,
            name: name
          }
        })

    // Set results
    const results = upsertProposalData.data.upsertProposal

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
      await upsertProposal()
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
