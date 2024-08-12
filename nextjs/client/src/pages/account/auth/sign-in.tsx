import { useEffect, useState } from 'react'
import { Button, FormControl, TextField, Typography } from '@mui/material'
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { getCsrfToken } from 'next-auth/react'
import Layout from '@/components/layout/layout'

export default function SignIn({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) {

  // State
  const [email, setEmail] = useState('')

  // Events
  useEffect(() => {

    // Return early if newDirName isn't set
    // setImageBasePath(window.location.protocol + '//' + window.location.host + '/img/')
  }, [])

  // Render
  return (
    <Layout userProfileId={undefined}>
      <div style={{ marginBottom: '2em', textAlign: 'center' }}>
        <form method='post' action='/api/auth/signin/email'>
          <input name='csrfToken' type='hidden' defaultValue={csrfToken} />

          <FormControl style={{ marginBottom: '2em', width: '20em' }}>
            <TextField
              id='email'
              label='Email'
              inputRef={input => input && input.focus()}
              name='email'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              variant='standard' />
          </FormControl>
          <br/>

          <Button
            type='submit'
            variant='contained'>
            Sign in with Email
           </Button>
        </form>
      </div>

      <div style={{ width: '100%' }}>
        <center>
          <div style={{width: '50%' }}>
            <Typography variant='body1'>
              Please enter the email address for your account, then click `Sign in with email`
              or press enter.
              <br/><br/>
              If you haven&apos;t signed up yet, this will create a new account for you.
            </Typography>
          </div>
        </center>
      </div>
    </Layout>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const csrfToken = await getCsrfToken(context)
  return {
    props: { csrfToken },
  }
}
