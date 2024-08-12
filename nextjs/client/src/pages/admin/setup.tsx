import { useMutation } from '@apollo/client'
import { runSetupMutation } from '@/apollo/admin'
import Layout, { pageBodyWidth } from '@/components/layout/layout'
import React, { useState } from 'react'
import { Alert, Button, Checkbox, FormControlLabel, Typography } from '@mui/material'
import { loadServerPage } from '@/services/page/load-server-page'

interface Props {
  clientUrl: string
  serverUrl: string
  userProfile: any
}

export default function SetupDataPage({
                          clientUrl,
                          serverUrl,
                          userProfile
                        }: Props) {

  // State
  const [submitDisabled, setSubmitDisabled] = useState(false)
  const [alertSeverity, setAlertSeverity] = useState<any>(undefined)
  const [message, setMessage] = useState<string>('')

  const [createOrUpdateBaseAndDemoData, setCreateOrUpdateBaseAndDemoData] = useState(false)
  const [deployVotingSmartContract, setDeployVotingSmartContract] = useState(false)
  const [deleteVotes, setDeleteVotes] = useState(false)
  const [deleteIssuesAndProposals, setDeleteIssuesAndProposals] = useState(false)

  // GraphQL
  const [sendRunSetupMutation] =
    useMutation(runSetupMutation, {
      /* onCompleted: data => {
        console.log(data)
      },
      onError: error => {
        console.log(error)
      } */
    })

  // Functions
  async function submitSetupData() {

    // Send GraphQL request
    var runSetupData: any = undefined

    await sendRunSetupMutation({
      variables: {
        userProfileId: userProfile.id,
        createOrUpdateBaseAndDemoData: createOrUpdateBaseAndDemoData,
        deployVotingSmartContract: deployVotingSmartContract,
        deleteVotes: deleteVotes,
        deleteIssuesAndProposals: deleteIssuesAndProposals
      }
    }).then((result: any) => runSetupData = result)

    // Process the results
    const results = runSetupData.data.runSetup

    if (results.status === true) {

      // Success
      setAlertSeverity('success')
      setMessage('Action(s) successful')
    } else {
      // Error
      setAlertSeverity('error')
      setMessage(results.message)
    }
  }

  return (
    <Layout userProfileId={userProfile.id}>
      <div style={{ margin: '0 auto', width: pageBodyWidth, verticalAlign: 'textTop' }}>
        <Typography variant='h4'>Setup data</Typography>
        <br/>

        {alertSeverity && message ?
          <Alert
            severity={alertSeverity}
            style={{ marginBottom: '2em' }}>
            {message}
          </Alert>
          :
          <></>
        }

        <div style={{ marginBottom: '2em' }}>
          <Typography
            style={{ marginBottom: '1em' }}
            variant='body1'>
            This form can be used for both the initial install, and for
            maintenance.
          </Typography>


          <FormControlLabel
            control={<Checkbox
                       checked={createOrUpdateBaseAndDemoData}
                       onChange={(e) => {
                        setCreateOrUpdateBaseAndDemoData(e.target.checked)
                       }} />}
            label={
              <Typography variant='body1'>
                Create or update base and demo data.
              </Typography>
            } />
          <br/>

          <FormControlLabel
            control={<Checkbox
                       checked={deployVotingSmartContract}
                       onChange={(e) => {
                        setDeployVotingSmartContract(e.target.checked)
                       }} />}
            label={
              <Typography variant='body1'>
                Deploy voting smart contract
              </Typography>
            } />
          <br/>

          <FormControlLabel
            control={<Checkbox
                       checked={deleteVotes}
                       onChange={(e) => {
                        setDeleteVotes(e.target.checked)
                       }} />}
            label={
              <Typography variant='body1'>
                Delete votes
              </Typography>
            } />
          <br/>

          <FormControlLabel
            control={<Checkbox
                       checked={deleteIssuesAndProposals}
                       onChange={(e) => {
                        setDeleteIssuesAndProposals(e.target.checked)
                       }} />}
            label={
              <Typography variant='body1'>
                Delete issues and proposals
              </Typography>
            } />
          <br/>
        </div>

        <form onSubmit={(e) => { submitSetupData(); e.preventDefault() }}>
          <Button type='submit' variant='contained' disabled={submitDisabled}>Setup</Button>
        </form>
      </div>
      <br/>
    </Layout>
  )
}

export async function getServerSideProps(context: any) {

  return await loadServerPage(
                 context,
                 false,  // loadChat
                 true,   // verifyLoggedInUsersOnly
                 true)   // verifyAdminUsersOnly
}
