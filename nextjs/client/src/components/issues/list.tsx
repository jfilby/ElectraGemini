import ViewIssueCard from './cards/view'
import { Typography } from '@mui/material'
import IssuesTopBar from './top-bar'

interface Props {
  tag: string | null
  issues: any[]
}

export default function ListIssues({
                          tag,
                          issues
                        }: Props) {

  // Render
  return (
    <div style={{ overflow: 'auto' }}>
      <IssuesTopBar tag={tag} />

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
