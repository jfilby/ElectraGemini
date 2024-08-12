import { useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { upsertVoteMutation, votingByRefIdQuery } from '@/apollo/voting'
import { Alert, Typography } from '@mui/material'
import VotingOption from './vote-option'

interface Props {
  instanceId: string
  userProfileId: string
  refModel: string
  refId: string
}

export default function VotingCard({
                          instanceId,
                          userProfileId,
                          refModel,
                          refId
                        }: Props) {

  // State
  const [alertSeverity, setAlertSeverity] = useState<any>(undefined)
  const [message, setMessage] = useState<boolean | undefined>(undefined)

  const [voteOptions, setVoteOptions] = useState<string[] | undefined>(undefined)
  const [voted, setVoted] = useState<string | undefined>(undefined)

  // GraphQL
  const [fetchVotingByRefIdQuery] =
    useLazyQuery(votingByRefIdQuery, {
      fetchPolicy: 'no-cache'
      /* onCompleted: data => {
        console.log('attributeTypeName: ' + attributeTypeName)
        console.log(data)
      },
      onError: error => {
        console.log(error)
      } */
    })

  const [sendUpsertVoteMutation] =
    useMutation(upsertVoteMutation, {
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
  async function getVoting() {

    // Query
    const votingByRefIdData =
      await fetchVotingByRefIdQuery(
        {
          variables: {
            instanceId: instanceId,
            userProfileId: userProfileId,
            refModel: refModel,
            refId: refId
          }
        })

    // Set results
    const results = votingByRefIdData.data.votingByRefId

    if (results.status === true) {

      setVoteOptions(results.voteOptions)
      setVoted(results.voted)
      } else {

      setAlertSeverity('error')
      setMessage(results.message)
    }

  }

  async function sendVote(option: string) {

    // Query
    const upsertVoteData =
      await sendUpsertVoteMutation(
        {
          variables: {
            instanceId: instanceId,
            userProfileId: userProfileId,
            refModel: refModel,
            refId: refId,
            option: option
          }
        })

    const results = upsertVoteData.data.upsertVote

    if (results.status === true) {

      setAlertSeverity('success')
      setMessage(results.message)

      // Update the state/UI
      setVoted(option)
    } else {

      setAlertSeverity('error')
      setMessage(results.message)
    }
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {
      await getVoting()
    }

    // Async call
    const result = fetchData()
      .catch(console.error)

  }, [])

  // Render
  return (
    <div style={{ marginBottom: '2em' }}>

      {alertSeverity && message ?
        <Alert
          severity={alertSeverity}
          style={{ marginBottom: '2em' }}>
          {message}
        </Alert>
        :
        <></>
      }

      <div>
        <Typography
          style={{ display: 'inline-block' }}
          variant='h6'>
          Vote:
        </Typography>

        <VotingOption
          option='Yes'
          voted={voted}
          sendVote={sendVote} />

        <VotingOption
          option='No'
          voted={voted}
          sendVote={sendVote} />
      </div>

    </div>
  )
}
