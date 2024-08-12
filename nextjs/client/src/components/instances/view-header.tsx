import { Typography } from '@mui/material'
import ViewTopBar from './top-nav/view'

interface Props {
  instance: any
  topBarTab: number
}

export default function ViewInstanceHeader({
                          instance,
                          topBarTab
                        }: Props) {

  // Render
  return (
    <div>
      <Typography
        onClick={(e) => {
            window.location.href = `/instance/${instance.id}`
          }}
          style={{ cursor: 'pointer' }}
          variant='h3'>
        {instance.name}
      </Typography>

      <Typography
        onClick={(e) => {
            window.location.href = `https://ai.google.dev/`
          }}
          style={{ cursor: 'pointer', marginBottom: '1em' }}
          variant='h5'>
        Powered by Google Gemini
      </Typography>

      <ViewTopBar
        instance={instance}
        currentTab={topBarTab} />
    </div>
  )
}
