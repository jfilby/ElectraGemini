import { CachedEmbeddingModel } from '@/serene-ai-server/models/cache/cached-embedding-model'
import { SnippetService } from '@/serene-ai-server/services/content/snippet-service'
import { GoogleVertexEmbeddingService } from '@/serene-ai-server/services/llm-apis/google-gemini/embedding-api'
import { NewsArticleIssueModel } from '@/models/news-articles/news-article-issue-model'
import { NewsArticleModel } from '@/models/news-articles/news-article-model'

export class NewsArticlesService {

  // Consts
  clName = 'NewsArticlesService'

  // Models
  cachedEmbeddingModel = new CachedEmbeddingModel()
  newsArticleIssueModel = new NewsArticleIssueModel()
  newsArticleModel = new NewsArticleModel()

  // Services
  googleVertexEmbeddingService = new GoogleVertexEmbeddingService()
  snippetService = new SnippetService()

  // Code

  async generateTextEmbedding(text: string) {

    // Debug
    const fnName = `${this.clName}.generateTextEmbedding()`

    // Make a call to the Google embeddings service
    const embedding = await
            this.googleVertexEmbeddingService.requestEmbedding(text)

    // Return the embedding
    return embedding
  }

  async generateEmbeddings(prisma: any) {

    // Debug
    const fnName = `${this.clName}.generateEmbeddings()`

    // Get a list of records to generate embeddings for
    const newsArticles = await
            this.newsArticleModel.getByRefreshEmbeddingsNeeded(prisma)

    // Debug
    console.log(`${fnName}: generating embeddings for ` +
                `${newsArticles.length} records`)

    // Generate and save embeddings for each record
    for (const newsArticle of newsArticles) {

      // Embedding var
      var embedding: any

      // Is an embedding needed? A title must be present
      if (newsArticle.title == null ||
          newsArticle.title.trim() === '') {

        embedding = null
      } else {
        // Get text
        var text = ''

        if (newsArticle.content != null) {
          text += `content: ${newsArticle.content}`
        }

        if (newsArticle.description != null) {

          if (text !== '') {
            text += '\n'
          }

          text += `description: ${newsArticle.description}`
        }

        // Generate an embedding
        const embeddingResults = await
          this.generateTextEmbedding(`${newsArticle.title}: ${text}`)

        if (embeddingResults.status === false) {
          return embeddingResults
        }

        embedding = embeddingResults.embedding.values
      }

      // Save the embedding
      await this.newsArticleModel.setEmbedding(
              prisma,
              newsArticle.id,
              embedding)
    }

    // Debug
    console.log(`${fnName}: returning..`)
  }

  async search(
          prisma: any,
          instanceId: string,
          userProfileId: string,
          issueId: string,
          status: string,
          input: string,
          page: number,
          verifyAccess: boolean) {

    // Get or generate an embedding for the input
    var inputEmbedding: any
    input = input.trim()

    const cachedEmbedding = await
            this.cachedEmbeddingModel.getByText(
              prisma,
              input)

    if (cachedEmbedding != null) {

      inputEmbedding = cachedEmbedding.embedding
    } else {
      // Generate an embedding
      const inputEmbeddingResults = await
              this.generateTextEmbedding(input)

      if (inputEmbeddingResults.status === false) {
        return inputEmbeddingResults
      }

      inputEmbedding = inputEmbeddingResults.embedding.values

      // Save the embedding
      await this.cachedEmbeddingModel.create(
              prisma,
              input,
              inputEmbedding)
    }

    // Search NewsArticles
    const newsArticlesResults = await
            this.newsArticleModel.searchIssueEmbeddings(
              prisma,
              issueId,
              inputEmbedding)

    // Get NewsArticles only
    var newsArticles: any[] = []

    for (const newsArticle of newsArticlesResults.newsArticles) {

      // Get snippet
      var snippet: string | undefined

      if (newsArticle.description != null) {
        snippet = this.snippetService.getSnippet(newsArticle.description)
      } else if (newsArticle.content != null) {
        snippet = this.snippetService.getSnippet(newsArticle.content)
      }

      // Add NewsArticle
      newsArticles.push({
        id: newsArticle.id,
        url: newsArticle.url,
        title: newsArticle.title,
        snippet: snippet
      })
    }

    // Return
    return {
      status: true,
      newsArticles: newsArticles,
      hasMore: false
    }
  }
}
