import FileResultCard from './result-card'
import { Typography } from '@mui/material'

interface Props {
  results: any[] | undefined
}

export default function ListFilesSearchResults({
                          results
                        }: Props) {

  // Render
  return (
    <div style={{ overflow: 'auto' }}>

      {results != null ?
        <>
          {results.length > 0 ?
            <>
              {results.map(result => (
                <FileResultCard
                  key={result.kbFile.id}
                  result={result} />
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
