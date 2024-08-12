import ViewProposalCard from './cards/view'
import { Typography } from '@mui/material'

interface Props {
  newsArticles: any[]
}

export default function ListNewsArticles({
                          newsArticles
                        }: Props) {

  // Render
  return (
    <div style={{ overflow: 'auto' }}>

      {newsArticles != null ?
        <>
          {newsArticles.length > 0 ?
            <>
              {newsArticles.map(newsArticle => (
                <ViewProposalCard
                  key={newsArticle.id}
                  newsArticle={newsArticle} />
              ))}
            </>
          :
            <Typography
              style={{ marginTop: '2em' }}
              variant='body1'>
              No news articles to list.
            </Typography>
          }
        </>
      :
        <></>
      }
    </div>
  )
}
