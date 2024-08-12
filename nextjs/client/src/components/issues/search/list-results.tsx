import { Typography } from '@mui/material'
import ViewIssueCard from '../cards/view'

interface Props {
  issues: any[] | undefined
}

export default function ListIssuesSearchResults({
                          issues
                        }: Props) {

  // Render
  return (
    <div style={{ overflow: 'auto' }}>

      {issues != null ?
        <>
          {issues.length > 0 ?
            <>
              {issues.map(issue => (
                <ViewIssueCard
                  key={issue.id}
                  issue={issue} />
              ))}
            </>
          :
            <Typography
              style={{ marginTop: '2em' }}
              variant='body1'>
              No issues to list.
            </Typography>
          }
        </>
      :
        <></>
      }
    </div>
  )
}
