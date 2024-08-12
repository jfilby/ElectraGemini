import { Typography } from '@mui/material'

interface Props {
  tag: string | null
}

export default function IssuesTopBar({
                          tag
                        }: Props) {

  // Render
  return (
    <>
      {tag != null ?
        <div style={{ marginBottom: '2em' }}>

          <Typography
            style={{ display: 'inline-block' }}
            variant='h6'>
            Filtered by:
          </Typography>

          <Typography
            style={{ display: 'inline-block', marginLeft: '1em' }}
            variant='body1'>
            tag: {tag}
          </Typography>
        </div>
      :
        <></>
      }
    </>
  )
}
