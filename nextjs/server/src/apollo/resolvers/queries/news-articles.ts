import { prisma } from '@/db'
import { CustomError } from '@/serene-core-server/types/errors'
import { NewsArticlesService } from '@/services/news-articles/service'

// Services
const newsArticlesService = new NewsArticlesService()

// Code
export async function searchNewsArticles(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  const fnName = `searchNewsArticles()`

  console.log(`${fnName}: args: ` + JSON.stringify(args))

  // Search news articles
  // Note: news articles must be searched, not filtered, as the AI leaves out
  //       irrelevant articles when generating issues.
  var results: any

  try {
    results = await
      newsArticlesService.search(
        prisma,
        args.instanceId,
        args.userProfileId,
        args.issueId,
        args.status,
        args.input,
        args.page,
        true)  // verifyAccess
  } catch (error) {
    if (error instanceof CustomError) {
      return {
        status: false,
        message: error.message
      }
    } else {
      return {
        status: false,
        message: `Unexpected error: ${error}`
      }
    }
  }

  // Debug
  // console.log(`${fnName}: results: ` + JSON.stringify(results))

  // Return
  return results
}
