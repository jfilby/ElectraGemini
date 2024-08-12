import {  Typography } from '@mui/material'

interface Props {
  option: string
  voted: string | undefined,
  sendVote: any
}

export default function VotingOption({
                          option,
                          voted,
                          sendVote
                        }: Props) {

  // Render
  return (
    <div style={{ display: 'inline-block', marginLeft: '2em' }}>
      <Typography
        variant='body1'
        onClick={(e) => {
          if (option === voted) {
            return
          }

          sendVote(option)
        }}
        style={{
          cursor: option === voted ? 'default' : 'pointer',
          display: 'inline-block',
          fontWeight: option === voted ? 'bold' : 'normal'
        }}>
        {option}
      </Typography>
    </div>
  )
}
