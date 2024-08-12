import {  Divider, Link, Typography } from '@mui/material'

interface Props {
  newsArticle: any
}

export default function ViewNewsArticleCard({
                          newsArticle
                        }: Props) {

  // Render
  return (
    <div style={{ minWidth: 275 }}>

      <div style={{ marginBottom: '1em' }}>
        <Link
          href={newsArticle.url}
          rel='noopener'
          target='_blank'>
          <Typography
            style={{ marginBottom: '0.5em' }}
            variant='h6'>
            {newsArticle.title}
          </Typography>
        </Link>

        <Typography
          style={{ marginBottom: '0.5em' }}
          variant='body1'>
          {newsArticle.snippet}
        </Typography>
      </div>

      <Divider
        style={{ marginBottom: '1em' }}
        variant='fullWidth' />
    </div>
  )
}
