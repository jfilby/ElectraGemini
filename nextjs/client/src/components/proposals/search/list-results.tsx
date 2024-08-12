import { Typography } from '@mui/material'
import ViewProposalCard from '../cards/view'

interface Props {
  proposals: any[] | undefined
}

export default function ListProposalsSearchResults({
                          proposals
                        }: Props) {

  // Render
  return (
    <div style={{ overflow: 'auto' }}>

      {proposals != null ?
        <>
          {proposals.length > 0 ?
            <>
              {proposals.map(proposal => (
                <ViewProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  withIssue={false} />
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
