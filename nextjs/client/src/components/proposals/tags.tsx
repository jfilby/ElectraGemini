import {  Chip } from '@mui/material'

interface Props {
  instanceId: string
  tags: any[]
}

export default function ProposalTags({
                          instanceId,
                          tags
                        }: Props) {

  // Render
  return (
    <div>
      {tags.length > 0 ?
        <div style={{ marginBottom: '1em' }}>
          {tags.map((tag: any) => (
            <Chip
              key={tag.proposalTagOption.id}
              label={tag.proposalTagOption.name}
              onClick={(e) => {
                window.location.href =
                  `/instance/${instanceId}/proposals?tag=${tag.proposalTagOption.name}`
              }}
              style={{ marginRight: '1em' }} />
          ))}
        </div>
      :
        <></>
      }
    </div>
  )
}
