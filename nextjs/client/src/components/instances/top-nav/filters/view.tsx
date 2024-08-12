import React from 'react'
import { ClientOnlyTypes } from '../../../../types/client-only-types'
import ChatsNavFilters from './chats'
import ContactsNavFilters from './contacts'
import DataNavFilters from './data'
import HomeNavFilters from './home'

interface Props {
  topBarTab: number
}

export default function NavFilters({
                          topBarTab
                        }: Props) {

  // Functions
  const renderSwitch = () => {

    // Render switch in a function: https://stackoverflow.com/a/52618847
    switch (topBarTab) {

      case ClientOnlyTypes.homeTopMenuTab:
        return <HomeNavFilters />

      case ClientOnlyTypes.contactsTopMenuTab:
        return <ContactsNavFilters />

      case ClientOnlyTypes.issuesTopMenuTab:
        return <></>

      case ClientOnlyTypes.proposalsTopMenuTab:
        return <></>

      case ClientOnlyTypes.chatsTopMenuTab:
        return <ChatsNavFilters />

      case ClientOnlyTypes.documentsTopMenuTab:
          return <></>

      case ClientOnlyTypes.dataTopMenuTab:
          return <DataNavFilters />

      default:
        return <>Unhandled topBarTab: {topBarTab}</>
    }
  }

  // Render
  return (
    <>
      {renderSwitch()}
    </>
  )
}
