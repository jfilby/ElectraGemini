import {  Chip } from '@mui/material'

interface Props {
  instanceId: string
  tags: any[]
}

export default function IssueTags({
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
              key={tag.issueTagOption.id}
              label={tag.issueTagOption.name}
              onClick={(e) => {
                window.location.href =
                  `/instance/${instanceId}/issues?tag=${tag.issueTagOption.name}`
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
