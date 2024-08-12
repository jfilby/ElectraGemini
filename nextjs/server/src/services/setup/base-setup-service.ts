import { CustomError } from '@/serene-core-server/types/errors'
import { TechModel } from '@/serene-core-server/models/tech/tech-model'
import { AiTechDefs } from '@/serene-ai-server/types/tech-defs'
import { AgentModel } from '@/serene-ai-server/models/agents/agent-model'
import { ChatSettingsModel } from '@/serene-ai-server/models/chat/chat-settings-model'
import { BaseDataTypes } from '@/types/base-data-types'
import { LangModel } from '@/models/lang/lang-model'
import { LegalGeoTypeModel } from '@/models/legal-geos/legal-geo-type-model'
import { ModelAttachFeatureModel } from '@/models/generic/model-attach-feature-model'
import { ModelAttachModel } from '@/models/generic/model-attach-model'
import { VoteSystemModel } from '@/models/voting/vote-system-model'
import { LoadGeoLocationDataService } from './sourced-data/load-geo-location-data-service'

export class BaseSetupService {

  // Consts
  clName = 'BaseSetupService'

  // Models
  agentModel = new AgentModel()
  chatSettingsModel = new ChatSettingsModel()
  langModel = new LangModel()
  legalGeoTypeModel = new LegalGeoTypeModel()
  modelAttachFeatureModel = new ModelAttachFeatureModel()
  modelAttachModel = new ModelAttachModel()
  techModel = new TechModel()
  voteSystemModel = new VoteSystemModel()

  // Services
  loadGeoLocationDataService = new LoadGeoLocationDataService()

  // Code
  async chatSettingsSetup(
          prisma: any,
          userProfileId: string) {

    // Debug
    const fnName = `${this.clName}.chatSettingsSetup()`

    // Get the default Tech
    const tech = await
            this.techModel.getDefaultProvider(
              prisma,
              AiTechDefs.llms)

    if (tech == null) {
      console.error(`${fnName}: tech == null`)
      throw new CustomError(`${fnName}: tech == null`)
    }

    // Upsert Agent record
    const agent = await
            this.agentModel.upsert(
              prisma,
              undefined,  // id
              BaseDataTypes.agentName,
              BaseDataTypes.agentRole,
              'Try to keep your answers brief and concise. ')  // defaultPrompt

    if (agent == null) {
      console.error(`${fnName}: agent == null`)
      throw new CustomError(`${fnName}: agent == null`)
    }

    // Debug
    console.log(`${fnName}: upserting ChatSettings record with ` +
                `userProfileId: ${userProfileId}`)

    // Upsert ChatSetting record
    await this.chatSettingsModel.upsert(
            prisma,
            undefined,  // id
            undefined,  // baseChatSettingsId
            BaseDataTypes.activeStatus,
            true,       // pinned
            'Default',
            tech.id,
            agent.id,
            undefined,  // prompt
            userProfileId)
  }

  async genericDataModelSetup(prisma: any) {

    // Attach multiple proposals to each issue
    await this.modelAttachModel.upsert(
            prisma,
            undefined,  // id
            BaseDataTypes.issueModel,
            BaseDataTypes.oneToManyRelation,
            BaseDataTypes.proposalModel)

    // Attach the voting feature to each proposal
    await this.modelAttachFeatureModel.upsert(
            prisma,
            undefined,  // id
            BaseDataTypes.proposalModel,
            BaseDataTypes.votingFeature)
  }

  async langSetup(prisma: any) {

    await this.langModel.upsert(
            prisma,
            undefined,  // id
            BaseDataTypes.english3LetterCode,
            BaseDataTypes.english2LetterCode,
            BaseDataTypes.english)
  }

  async legalGeoSetup(prisma: any) {

    // Debug
    const fnName = `${this.clName}.legalGeoSetup()`

    // Upsert all legal geo types
    for (const name of BaseDataTypes.legalGeoTypes) {

      console.log(`${fnName}: upsert LegalGeoType for name: ${name}`)

      await this.legalGeoTypeModel.upsert(
              prisma,
              undefined,  // id
              name)
    }
  }

  async setup(prisma: any,
              userProfileId: string) {

    // Debug
    const fnName = `${this.clName}.setup()`

    console.log(`${fnName}: starting..`)

    // Chat settings
    await this.chatSettingsSetup(
            prisma,
            userProfileId)

    // Languages
    await this.langSetup(prisma)

    // Legal geos
    await this.legalGeoSetup(prisma)

    // Sourced geo location data
    await this.loadGeoLocationDataService.load(prisma)

    // Generic data model
    await this.genericDataModelSetup(prisma)

    // Vote systems
    await this.voteSystemSetup(prisma)

    // Return
    return {
      status: true
    }
  }

  async voteSystemSetup(prisma: any) {

    await this.voteSystemModel.upsert(
            prisma,
            undefined,              // id
            true,                   // isDefault
            false,                  // isWeighted
            false,                  // isFullyExternal
            false,                  // isBlockchainBased
            true,                   // isBooleanVoteType
            [],                     // voteOptions
            BaseDataTypes.yesOrNoVotingSystem,  // voteTypeSystem
            'Basic Yes/No voting',  // name
            undefined)              // url
  }
}
