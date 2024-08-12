import { useEffect, useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { Box, Grid, Link, Typography } from '@mui/material'
import { HeaderBrowserLink } from './header-browser-link'

const HEADER_HEIGHT = 50

interface Props {
  highLevelLink: string
}

export function HeaderBrowser({ highLevelLink }: Props) {

  // Session
  const { data: session } = useSession()

  // State
  const [active, setActive] = useState('')

  // Effects
  useEffect(() => {
    setActive(window.location.pathname)
  }, [])

  return (
    <Box height={HEADER_HEIGHT}>
      <Grid container spacing={2} style={{ marginTop: '-0.5em' }}>
        <Grid item xs={9} style={{ textAlign: 'left' }}>
          <Typography variant='body1'>
            <HeaderBrowserLink
              name={process.env.NEXT_PUBLIC_APP_NAME}
              linkName=''
              highLevelLink={highLevelLink} />
            &nbsp;
            &nbsp;
            <HeaderBrowserLink
              name='My instances'
              linkName='instances'
              highLevelLink={highLevelLink} />
            &nbsp;
            &nbsp;
            <HeaderBrowserLink
              name='Demo instances'
              linkName='instances/demos'
              highLevelLink={highLevelLink} />
            &nbsp;
            &nbsp;
          </Typography>
        </Grid>
        <Grid item xs={3} style={{ textAlign: 'right' }}>
          <Typography variant='body1'>
            {/* <HeaderBrowserLink
              name='Docs'
              linkName='docs'
              highLevelLink={highLevelLink} />
            &nbsp;
            &nbsp;
            <HeaderBrowserLink
              name='About'
              linkName='about'
              highLevelLink={highLevelLink} />
            &nbsp;
            &nbsp;
            <HeaderBrowserLink
              name='Account'
              linkName='account'
              highLevelLink={highLevelLink} /> */}
            &nbsp;
            &nbsp;
            &nbsp;
            &nbsp;
            { session &&
              <Link href='#' onClick={(e) => {
                e.preventDefault()
                signOut()
              }} className='btn-signin'>
                Sign out
              </Link>
            }
            { !session &&
              <Link href='#' onClick={(e) => {
                e.preventDefault()
                signIn()
              }} className='btn-signin'>
                Sign in
              </Link>
            }
          </Typography>
        </Grid>
      </Grid>
    </Box>
  )
}
