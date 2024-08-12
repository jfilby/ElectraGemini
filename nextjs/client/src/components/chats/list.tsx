import { Typography } from '@mui/material'
import ViewChatListItem from './list-item'

interface Props {
  instanceId: string
  chatSessions: any
}

export default function ViewChatList({
                          instanceId,
                          chatSessions
                        }: Props) {

  // Render
  return (
    <>
      {chatSessions.length > 0 ?
        <Typography variant='body1'>
          History:
        </Typography>
      :
        <></>
      }

      {chatSessions.map((chatSession: any) => (
        <ViewChatListItem
          key={chatSession.id}
          instanceId={instanceId}
          chatSession={chatSession} />
      ))}
    </>
  )
}
