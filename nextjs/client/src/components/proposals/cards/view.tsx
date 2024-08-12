import {  Divider, Link, Typography } from '@mui/material'
import ProposalTags from '../tags'

interface Props {
  proposal: any
  withIssue: boolean
}

export default function ViewProposalCard({
                          proposal,
                          withIssue
                        }: Props) {

  // Consts
  const url = `/instance/${proposal.instanceId}/proposal/${proposal.id}`

  // Render
  return (
    <div style={{ minWidth: 275 }}>

      <div style={{ marginBottom: '1em' }}>
        <Link href={url}>
          <Typography
            style={{ marginBottom: '0.5em' }}
            variant='h6'>
            {proposal.kbFile.name}
          </Typography>
        </Link>

        <Typography
          style={{ marginBottom: '0.5em' }}
          variant='body1'>
          {proposal.kbFile.snippet}
        </Typography>

        {/* {proposal.user.userProfile.name != null ?
          <>{proposal.user.userProfile.createdByName}</>
        :
          <></>} */}

        {/*<p>proposal: {JSON.stringify(proposal)}</p>*/}

        <ProposalTags
          instanceId={proposal.instanceId}
          tags={proposal.tags} />

        {withIssue === true ?
          <div>
            <Typography
              style= {{ marginRight: '2em' }}
              variant='caption'>
              Issue: {proposal.issue.kbFile.name}
            </Typography>
          </div>
        :
          <></>
        }

        <div>
          <Typography variant='caption'>
            Votes: {proposal.votes}
          </Typography>
        </div>
      </div>

      <Divider
        style={{ marginBottom: '1em' }}
        variant='fullWidth' />
    </div>
  )
}
