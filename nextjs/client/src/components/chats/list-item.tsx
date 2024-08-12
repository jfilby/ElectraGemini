import { Typography } from '@mui/material'

interface Props {
  instanceId: string
  chatSession: any
}

export default function ViewChatListItem({
                          instanceId,
                          chatSession
                        }: Props) {

  // Functions
  function prepText(s: string) {

    // If no name given, it's general discussion
    if (s == null) {
      return 'General discussion'
    }

    // Shorten if necessary
    if (s.length < 50) {
      return s
    }

    return s.substring(0, 49) + '..'
  }

  // Render
  return (
    <Typography
      key={chatSession.id}
      onClick={(e) => {
        window.location.href = `/instance/${instanceId}/chat/${chatSession.id}`
      }}
      style={{ cursor: 'pointer', marginBottom: '0.5em' }}
      title={chatSession.name + ` (${new Date(Number(chatSession.updated)).toString()})`}
      variant='body2'>
      {prepText(chatSession.name)}
    </Typography>
  )
}
