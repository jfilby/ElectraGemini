import ViewProposalCard from './cards/view'
import { Typography } from '@mui/material'
import ProposalsTopBar from './top-bar'

interface Props {
  instanceId: string
  tag: string | null
  proposals: any[]
  withIssues: boolean
}

export default function ListProposals({
                          instanceId,
                          tag,
                          proposals,
                          withIssues
                        }: Props) {

  // Render
  return (
    <div style={{ overflow: 'auto' }}>
      <ProposalsTopBar tag={tag} />

      {proposals != null ?
        <>
          {proposals.length > 0 ?
            <>
              {proposals.map(proposal => (
                <ViewProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  withIssue={withIssues} />
              ))}
            </>
          :
            <Typography
              style={{ marginTop: '2em' }}
              variant='body1'>
              No proposals to list.
            </Typography>
          }
        </>
      :
        <></>
      }
    </div>
  )
}
