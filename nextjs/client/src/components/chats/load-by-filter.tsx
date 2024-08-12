import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { getInstanceChatSessionsQuery } from '../../apollo/instance-chats'
import { BaseDataTypes } from '../../types/base-data-types'

interface Props {
  instanceId: string,
  userProfileId: string
  setChatSessions: any
  refresh: boolean
  setRefresh: any
}

export default function LoadChatsByFilter({
                          instanceId,
                          userProfileId,
                          setChatSessions,
                          refresh,
                          setRefresh
                        }: Props) {

  // GraphQL
  const [fetchInstanceChatsQuery] =
    useLazyQuery(getInstanceChatSessionsQuery, {
      fetchPolicy: 'no-cache'
      /* onCompleted: data => {
        console.log('elementName: ' + elementName)
        console.log(data)
      },
      onError: error => {
        console.log(error)
      } */
    })

  // Functions
  async function getChatSessions() {

    // Debug
    const fnName = `getChatSessions()`

    // Query
    const getChatInstanceSessionsData =
      await fetchInstanceChatsQuery(
        {
          variables: {
            instanceId: instanceId,
            status: BaseDataTypes.activeStatus,
            userProfileId: userProfileId
          }
        })

    // Set results
    const results = getChatInstanceSessionsData.data.getInstanceChatSessions

    setChatSessions(results)
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {
      await getChatSessions()
    }

    // Only proceed if refresh is true
    if (refresh === false) {
      return
    } else {
      setRefresh(false)
    }

    // Async call
    const result = fetchData()
      .catch(console.error)

  }, [refresh])

  // Render
  return (
    <></>
  )
}
