import {  Divider, Link, Typography } from '@mui/material'
import IssueTags from '../tags'

interface Props {
  issue: any
}

export default function ViewIssueCard({ issue }: Props) {

  // Consts
  const url = `/instance/${issue.instanceId}/issue/${issue.id}`

  // Render
  return (
    <div style={{ minWidth: 275 }}>

      <div style={{ marginBottom: '1em' }}>
        <Link href={url}>
          <Typography
            style={{ marginBottom: '0.5em' }}
            variant='h6'>
            {issue.kbFile.name}
          </Typography>
        </Link>

        <Typography
          style={{ marginBottom: '0.5em' }}
          variant='body1'>
          {issue.kbFile.snippet}
        </Typography>

        {/* {issue.user.userProfile.name != null ?
          <>{issue.user.userProfile.createdByName}</>
        :
          <></>} */}

        <IssueTags
          instanceId={issue.instanceId}
          tags={issue.tags} />

        {issue.proposalCount != null ?
          <div>
            <Typography variant='caption'>
              Proposals: {issue.proposalCount}
            </Typography>
          </div>
        :
          <></>
        }
      </div>

      <Divider
        style={{ marginBottom: '1em' }}
        variant='fullWidth' />
    </div>
  )
}
