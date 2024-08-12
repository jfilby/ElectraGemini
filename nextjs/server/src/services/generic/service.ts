import { BaseDataTypes } from '@/types/base-data-types'
import { ModelAttachFeatureModel } from '@/models/generic/model-attach-feature-model'
import { ModelAttachModel } from '@/models/generic/model-attach-model'
import { VotingService } from '../voting/service'
import { CustomError } from '@/serene-core-server/types/errors'

export class GenericModelsService {

  // Consts
  clName = 'GenericModelsService'

  // Models
  modelAttachFeatureModel = new ModelAttachFeatureModel()
  modelAttachModel = new ModelAttachModel()

  // Services
  votingService = new VotingService()

  // Code
  async addFeatures(
          prisma: any,
          instanceId: string,
          refModel: string,
          refId: string) {

    // Debug
    const fnName = `${this.clName}.addFeatures()`

    // Get models to attach
    const models = await
            this.modelAttachFeatureModel.getByModel(
              prisma,
              refModel)

    // Attach objects by model
    for (const model of models) {

      switch(model.attachFeature) {

        case BaseDataTypes.votingFeature: {
          await this.votingService.addObject(
                  prisma,
                  instanceId,
                  refModel,
                  refId)

          break
        }

        default: {
          throw new CustomError(`${fnName}: unknown feature: ` +
                                JSON.stringify(model.attachFeature))
        }
      }
    }
  }
}
