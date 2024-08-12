import { BaseDataTypes } from '@/types/base-data-types'
import { CustomError } from '@/serene-core-server/types/errors'
import { InstanceModel } from '@/models/instances/instance-model'
import { NewsApiOrgService } from './newsapi-org-api-service'

export class NewsApiOrgServiceTests {

  // Consts
  clName = 'NewsApiOrgServiceTests'

  // Models
  instanceModel = new InstanceModel()

  // Services
  newsApiOrgService = new NewsApiOrgService()

  // Code
  async tests(prisma: any) {

    // Debug
    const fnName = `${this.clName}.tests()`

    // Get test instance
    const instance = await
            this.instanceModel.getByName(
              prisma,
              BaseDataTypes.electraAiPartyForUsa)

    if (instance == null) {
      throw new CustomError(``)
    }

    // Import news articles
    await this.newsApiOrgService.importByCountryTopHeadlines(prisma)
  }
}
