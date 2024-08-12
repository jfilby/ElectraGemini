import { BaseDataTypes } from '@/types/base-data-types'
import { LangModel } from '@/models/lang/lang-model'
import { PoliticalPartyTemplatesSetupService } from './instance-templates/political-party'
import { SouthAfricaPartyDemoSetupService } from './instance-demos/political-parties/south-africa-party'
import { UsaPartyDemoSetupService } from './instance-demos/political-parties/usa-party'

export class DemoSetupService {

  // Consts
  clName = 'DemoSetupService'

  // Models
  langModel = new LangModel()

  // Services
  politicalPartyTemplatesSetupService = new PoliticalPartyTemplatesSetupService()

  southAfricaPartyDemoSetupService = new SouthAfricaPartyDemoSetupService()
  usaPartyDemoSetupService = new UsaPartyDemoSetupService()

  // Code
  async setup(
          prisma: any,
          userProfile: any) {

    // Debug
    const fnName = `${this.clName}.setup()`

    console.log(`${fnName}: starting..`)

    // Get the English lang
    const englishLang = await
            this.langModel.getByIso639_2Code(
              prisma,
              BaseDataTypes.english3LetterCode)

    // Setup demo data for political party template instances
    await this.politicalPartyTemplatesSetupService.setup(
            prisma,
            englishLang,
            userProfile)

    // Setup demo data for a USA political party
    await this.usaPartyDemoSetupService.setup(
            prisma,
            englishLang,
            userProfile)

    // Setup demo data for a South African political party
    await this.southAfricaPartyDemoSetupService.setup(
            prisma,
            englishLang,
            userProfile)

    // Return
    return {
      status: true
    }
  }
}
