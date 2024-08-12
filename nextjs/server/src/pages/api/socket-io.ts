// server/src/apis/socket-io.ts
import express from 'express'
import http from 'http'
import { Server as SocketIoServer } from 'socket.io'
import { PrismaClient } from '@prisma/client'
import { ChatSessionService } from '@/serene-ai-server/services/chats/sessions/chat-session-service'

const prisma = new PrismaClient()
const app = express()
const server = http.createServer(app)
const io = new SocketIoServer(
                 server,
                 {
                   cors: {
                     origin: '*',
                   },
                   // transports: ['websocket']
                 })

const chatSessionService = new ChatSessionService()

io.on('connection', (socket) => {
  console.log('A user connected')

  // Handle chat session join event with authorization
  socket.on('joinChatSession', async (data) => {
    const { chatSessionId, chatSessionToken, chatParticipantId } = data

    // Validate chat session based on the token
    const chatSession = await prisma.chatSession.findUnique({
      where: {
        id: chatSessionId,
        token: chatSessionToken,
      },
    })

    const chatParticipantCount = await prisma.chatParticipant.count({
      where: {
        id: chatParticipantId,
        chatSessionId: chatSessionId
      }
    })

    if (chatSession != null &&
        chatParticipantCount > 0) {

      socket.join(chatSessionId)
      console.log(`User joined chatSession with id: ${chatSessionId}`)

      // Inform the client that they have successfully joined the chat session
      socket.emit('chatSessionIdJoined', chatSessionId)
    } else {

      // Inform the client about authorization failure
      socket.emit('authorizationFailed')
    }
  })

  // Handle messages from clients in async
  socket.on('message', async (data) => {

    // Debug
    const fnName = `socket.on('message')`
    // console.log(`message: data: ${JSON.stringify(data)}`)

    // Broadcast the message to all clients in the specified chat session
    const { chatSessionId, chatParticipantId, name, userProfileId, contents } = data

    io.to(chatSessionId).emit('message', data)

    // Chat session turn
    var sessionTurnData: any = undefined

    try {
      sessionTurnData = await
        chatSessionService.runSessionTurn(
          prisma,
          chatSessionId,
          chatParticipantId,
          userProfileId,
          name,
          contents)
    } catch(e: any) {
      io.to(chatSessionId).emit('message',{
        chatSessionId: chatSessionId,
        contents: [{
          type: 'error',
          text: e.message
        }]
      })
      return
    }

    // Reply data var
    var replyData: any = null

    // Rate limited?
    if (sessionTurnData.isRateLimited === true) {

      replyData = {
        chatSessionId: chatSessionId,
        contents: [{
          type: 'error',
          text: `Please try again in ${sessionTurnData.waitSeconds}s (rate limited).`
        }]
      }
    } else {

      // Save the messages
      await prisma.$transaction(async (transactionPrisma) => {

        await chatSessionService.saveMessages(
                transactionPrisma,
                sessionTurnData.chatSession,
                sessionTurnData)
      })

      // Formulate the replyData
      replyData = {
        sentByAi: true,
        chatSessionId: chatSessionId,
        chatParticipantId: sessionTurnData.toChatParticipantId,
        userProfileId: sessionTurnData.toUserProfileId,
        name: sessionTurnData.toName,
        contents: sessionTurnData.toContents  // Should be a JSON array
      }
    }

    // console.log(`${fnName}: replyData: ${JSON.stringify(replyData)}`)

    io.to(chatSessionId).emit('message', replyData)
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected')
  })
})

const socketIoPort = 3002  // or any other port you prefer
server.listen(
  socketIoPort,
  () => {
    console.log(`Socket.io server is running on port ${socketIoPort}`)
  })

// export default server
export default () => {}
