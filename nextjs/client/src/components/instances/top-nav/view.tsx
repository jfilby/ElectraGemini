import { ReactElement, useState } from 'react'
import { Tab, Tabs, Typography } from '@mui/material'
import NavFilters from './filters/view'

interface Props {
  instance: any
  currentTab: number
}

export default function ViewTopBar({
                          instance,
                          currentTab
                        }: Props) {

  interface LinkTabProps {
    label?: ReactElement
    href: string
    style: any | undefined
  }
  
  function LinkTab(props: LinkTabProps) {
    return (
      <Tab
        component='a'
        onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
          event.preventDefault()
          window.location.href = props.href
        }}
        {...props}
      />
    )
  }
  
  // Consts
  const homeUrl = `/instance/${instance.id}`
  const contactsUrl = `${homeUrl}/contacts`
  const issuesUrl = `${homeUrl}/issues`
  const proposalsUrl = `${homeUrl}/proposals`
  const chatsUrl = `${homeUrl}/chats`
  const documentsUrl = `${homeUrl}/documents`
  const dataUrl = `${homeUrl}/data`

  const [value, setValue] = useState(currentTab)

  // Functions
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  // Render
  return (
    <>
      <Tabs
        aria-label='tabs'
        onChange={handleChange}
        style={{ marginBottom: '2em' }}
        value={value}>

        <LinkTab
          label={<Typography variant='button'>Home</Typography>}
          href={homeUrl}
          style={undefined} />

        <LinkTab
          label={<Typography variant='button'>Contacts</Typography>}
          href={contactsUrl}
          style={{ display: 'none' }} />

        <LinkTab
          label={<Typography variant='button'>Issues</Typography>}
          href={issuesUrl}
          style={undefined} />

        <LinkTab
          label={<Typography variant='button'>Proposals</Typography>}
          href={proposalsUrl}
          style={undefined} />

        <LinkTab
          label={<Typography variant='button'>Chats</Typography>}
          href={chatsUrl}
          style={undefined} />

        <LinkTab
          label={<Typography variant='button'>Documents</Typography>}
          href={documentsUrl}
          style={undefined} />

        <LinkTab
          label={<Typography variant='button'>Data</Typography>}
          href={dataUrl}
          style={{ display: 'none' }} />
      </Tabs>

      {/* <NavFilters topBarTab={currentTab} /> */}
    </>
  )
}
