import { CustomError } from '@/serene-core-server/types/errors'
import { ServerOnlyTypes } from '../../../types/server-only-types'

export class OpenAIGenericLlmService {

  // Consts
  clName = 'OpenAIGenericLlmService'

  // OpenAI consts
  stopReason = 'stop'
  lengthReason = 'length'
  contentFilterReason = 'content_filter'
  nullReason = 'null'

  // Code
  convertOpenAiChatCompletionResults(openAiResults: any) {

    // Debug
    const fnName = `${this.clName}.convertOpenAiChatCompletionResults()`

    // Validate
    if (openAiResults == null) {

      throw new CustomError(`${fnName}: openAiResults == null`)
    }

    // Initial results map
    var results = {
      status: true,
      model: undefined,
      message: '',     // Error message (if any)
      messages: [],    // Reply messages,
      inputTokens: 0,
      outputTokens: 0,
      actualTech: undefined,
      createdPgCacheEdge: undefined
    }

    // Initial results conversion
    results =
      this.convertOpenAiResults(
        openAiResults,
        results)

    // Get input and output token counts
    results.model = openAiResults.model
    results.inputTokens = openAiResults.usage.prompt_tokens
    results.outputTokens = openAiResults.usage.completion_tokens

    // Return
    return results
  }

  convertOpenAiResults(
    openAiResults: any,
    results: any) {      // Existing results (just an initial map)

    // Debug
    const fnName = `${this.clName}.convertOpenAiResults()`

    // Validate
    if (openAiResults.choices == null) {
      throw 'openAiResults.choices is null'
    }

    // Handle errors
    for (const choice of openAiResults.choices) {

      if (choice.finish_reason !== this.stopReason) {
        results.status = false

        if (results.message.length > 0) {
          results.message += '\n'
        }

        switch(choice.finish_reason) {

          case (this.stopReason): { break }

          case (this.lengthReason): {
            results.message +=
              'Incomplete model output due to max_tokens parameter or token limit.'
            break
          }

          case (this.contentFilterReason): {
            results.message +=
              'Omitted content due to a flag from OpenAI content filters.'
            break
          }

          case (this.nullReason): {
            results.message += 'API response still in progress or incomplete.'
            break
          }

          default: {
            results.message += 
              `Unhandled error type: ${choice.finish_reason}. Please check ` +
              'the OpenAI API reference.'
            break
          }
        }
      }

      // Attach return message
      results.messages.push(choice.message.content)
    }

    // Debug
    // console.log(`${fnName}: results: ${JSON.stringify(results)}`)

    // Return
    return results
  }

  estimateInputTokens(messages: any[]) {

    // Debug
    const fnName = `${this.clName}.estimateInputTokens()`

    // console.log(`${fnName}: starting..`)

    // Calculate total length of words
    var words = 0

    for (const message of messages) {

      // console.log(`${fnName}: message: ${JSON.stringify(message)}`)

      // Validate
      if (message.role == null) {
        throw new CustomError(`${fnName}: message.role == null`)
      }

      if (message.parts == null) {
        throw new CustomError(`${fnName}: message.parts == null`)
      }

      // Add role (1: 'role: ')
      words += 1 + message.role.split(' ').length

      // Add messages
      for (const part of message.parts) {

        if (part.text == null) {
          throw new CustomError(`${fnName}: part.text == null`)
        }

        words += part.text.split(' ').length
      }
    }

    // Calculate input tokens
    const tokens = words / 4 * 3

    // Debug
    // console.log(`${fnName}: tokens: ${tokens}`)

    // Return
    return tokens
  }

  estimateOutputTokens(
    prisma: any,
    messages: any[]) {

    /* Try to get a similar cached result
    const llmCachedResult = await prisma.llmCache.findFirst({
      where: {
        activityMessages: activityMessages
      }
    }) */

    // If not estimate found, return the max of the OpenAI ChatCompletion price
    // window.
    return 1000
  }

  prepareMessages(
    prisma: any,
    tech: any,
    name: string,
    role: string,
    systemPrompt: string | undefined,
    messages: any[],
    anonymize: boolean) {

    // Debug
    const fnName = `${this.clName}.prepareMessages()`

    console.log(`${fnName}: starting..`)

    // Create messagesWithRoles
    var messagesWithRoles: any[] = []

    // Set the role with a system message
    if (role != null) {

      // If the role isn't anonymous, start with a name
      var roleContent: string

      if (anonymize === false) {
        roleContent = `You ${name}, a ${role}.`
      } else {
        roleContent = `You are a ${role}.`
      }

      messagesWithRoles.push({
        role: ServerOnlyTypes.chatGptSystemMessageRole,
        content: roleContent
      })
    }

    // System prompt
    if (systemPrompt != null) {

      messagesWithRoles.push({
        role: ServerOnlyTypes.chatGptSystemMessageRole,
        content: systemPrompt
      })
    }
  
    // Inform messages set the context
    for (const message of messages) {

      // Get message content
      var content = ''

      for (const part of message.parts) {

        if (content.length > 0) {
          content += '\n'
        }

        content += part.text
      }

      // Get the OpenAI role
      var role: string

      switch (message.role) {
        case 'user': {
          role = ServerOnlyTypes.chatGptUserMessageRole
          break
        }

        case 'model': {
          role = ServerOnlyTypes.chatGptAssistantMessageRole
          break
        }

        default: {
          throw new CustomError(`${fnName}: unhandled message role ` +
                                JSON.stringify(message.role)
          )
        }
      }

      // Add to messages
      messagesWithRoles.push({
        role: role,
        content: content
      })
    }

    // Estimate the input and output tokens
    const estimatedInputTokens =
            this.estimateInputTokens(messages)

    const estimatedOutputTokens =
           this.estimateOutputTokens(
              prisma,
              messages)

    // Variant name: may have to determine this based on input tokens and the
    // estimated output tokens.
    const variantName = tech.variantName

    // Return
    // console.log(`${fnName}: returning..`)
    // console.log(`${fnName}: messagesWithRoles: ` +
    //             JSON.stringify(messagesWithRoles))

    return {
      messages: messagesWithRoles,
      variantName: variantName,
      estimatedInputTokens: estimatedInputTokens,
      estimatedOutputTokens: estimatedOutputTokens
    }
  }
}
