import {  Divider, Link, Typography } from '@mui/material'

interface Props {
  result: any
}

export default function FileResultCard({ result }: Props) {

  // Consts
  const url = `/instance/${result.kbFile.instanceId}/document/${result.kbFile.id}`

  // Render
  return (
    <div style={{ minWidth: 275 }}>

      <div style={{ marginBottom: '1em' }}>
        <Link href={url}>
          <Typography
            style={{ marginBottom: '0.5em' }}
            variant='h6'>
            {result.kbFile.name}
          </Typography>
        </Link>

        <Typography variant='body1'>
          {result.kbFile.snippet}
        </Typography>
      </div>

      <Divider
        style={{ marginBottom: '1em' }}
        variant='fullWidth' />
    </div>
  )
}
