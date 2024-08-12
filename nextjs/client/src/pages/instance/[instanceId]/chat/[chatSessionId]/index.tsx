import Head from 'next/head'
import { useState } from 'react'
import ViewChatSession from '@/serene-ai-client/components/chat/view/session'
import { ClientOnlyTypes } from '@/types/client-only-types'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout, { pageBodyWidthPlus } from '@/components/layout/full-height-layout'
import LoadInstanceById from '@/components/instances/load-by-id'
import ChatInfoBar from '@/components/chats/info-bar'
import LoadChats from '@/components/chats/load-by-filter'
import ViewChatList from '@/components/chats/list'
import ViewInstanceHeader from '@/components/instances/view-header'

interface Props {
  instanceId: string
  chatSession: any
  userProfile: any
}

export default function ViewChatsPage({
                          instanceId,
                          chatSession,
                          userProfile
                        }: Props) {

  // State
  const [instance, setInstance] = useState<any>(undefined)
  const [chatSessions, setChatSessions] = useState<any>(undefined)
  const [refresh, setRefresh] = useState(true)

  // Render
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - Chat</title>
      </Head>

      <LoadInstanceById
        id={instanceId}
        userProfileId={userProfile.id}
        setInstance={setInstance}
        includeStats={false} />

      <LoadChats
        instanceId={instanceId}
        userProfileId={userProfile.id}
        setChatSessions={setChatSessions}
        refresh={refresh}
        setRefresh={setRefresh} />

      <Layout userProfileId={userProfile.id}>
        <div style={{ margin: '0 auto', width: pageBodyWidthPlus, verticalAlign: 'textTop' }}>

          {instance != null ?
            <ViewInstanceHeader
              instance={instance}
              topBarTab={ClientOnlyTypes.chatsTopMenuTab} />
          :
            <>Loading..</>
          }

          {/* <p>chats: {JSON.stringify(chats)}</p> */}
          {/* <p>chatSession: {JSON.stringify(chatSession)}</p> */}

          <div style={{ display: 'inline-block', verticalAlign: 'top', width: '20%' }}>
            {chatSessions != null ?
              <ViewChatList
                instanceId={instanceId}
                chatSessions={chatSessions} />
            :
              <></>
            }
          </div>
          <div style={{ display: 'inline-block', verticalAlign: 'top', width: '80%' }}>
            {chatSession != null ?
              <>
                <ChatInfoBar
                  instanceId={instanceId}
                  chatSession={chatSession} />

                <ViewChatSession
                  chatSession={chatSession}
                  userProfileId={userProfile.id}
                  showInputTip={undefined}
                  setShowInputTip={undefined}
                  showNextTip={undefined}
                  setShowNextTip={undefined} />
              </>
            :
              <></>
            }
          </div>

        </div>
      </Layout>
    </>
  )
}

export async function getServerSideProps(context: any) {

  return loadServerPage(
          context,
          true,   // loadChat,
          false)  // verifyLoggedInUsersOnly
}
