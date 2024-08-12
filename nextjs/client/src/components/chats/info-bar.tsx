import { Link, Typography } from '@mui/material'

interface Props {
  instanceId: string
  chatSession: any
}

export default function ChatInfoBar({
                          instanceId,
                          chatSession
                        }: Props) {

  // Render
  return (
    <div style={{ marginBottom: '1em' }}>
      <Typography style={{ display: 'inline-block' }}>
        Discussing&nbsp;
      </Typography>

      {chatSession.issue != null ?
        <>
          <Typography style={{ display: 'inline-block' }}>
            issue:&nbsp;
          </Typography>
          <Link
            href={`/instance/${instanceId}/issue/${chatSession.issue.id}`}
            style={{ display: 'inline-block' }}>
            <Typography>
              {chatSession.issue.name}&nbsp;
            </Typography>
          </Link>
        </>
      :
        <Link
          href={`/instance/${instanceId}/issues`}
          style={{ display: 'inline-block' }}>
          <Typography>
            all issues
          </Typography>
        </Link>
      }

      {chatSession.issue != null &&
       chatSession.proposal != null ?
        <Typography style={{ display: 'inline-block' }}>
          and&nbsp;
        </Typography>
      :
        <></>
      }

      {chatSession.proposal != null ?
        <>
          <Typography style={{ display: 'inline-block' }}>
            proposal:&nbsp;
          </Typography>
          <Link
            href={`/instance/${instanceId}/proposal/${chatSession.proposal.id}`}
            style={{ display: 'inline-block' }}>
            <Typography>
              {chatSession.proposal.name}
            </Typography>
          </Link>
        </>
      :
        <></>
      }
    </div>
  )
}
