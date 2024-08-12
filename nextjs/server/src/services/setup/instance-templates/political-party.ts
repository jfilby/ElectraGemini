import { CustomError } from '@/serene-core-server/types/errors'
import { BaseDataTypes } from '@/types/base-data-types'
import { InstanceModel } from '@/models/instances/instance-model'
import { LangModel } from '@/models/lang/lang-model'
import { LegalGeoModel } from '@/models/legal-geos/legal-geo-model'
import { LegalGeoTypeModel } from '@/models/legal-geos/legal-geo-type-model'
import { OrgCommonRecommendedDataSetup } from './org-common'
import { PoliticalNewsQueries } from './political-news-queries'

export class PoliticalPartyTemplatesSetupService {

  // Consts
  clName = 'PoliticalPartyTemplatesSetupService'

  // Models
  instanceModel = new InstanceModel()
  legalGeoModel = new LegalGeoModel()
  legalGeoTypeModel = new LegalGeoTypeModel()
  langModel = new LangModel()

  // Services
  orgCommonRecommendedDataSetup = new OrgCommonRecommendedDataSetup()
  politicalNewsQueries = new PoliticalNewsQueries()

  // Code
  async setupCityTemplate(
          prisma: any,
          englishLang: any,
          userProfile: any) {

    // Debug
    const fnName = `${this.clName}.setupCityTemplate()`

    console.log(`${fnName}: starting..`)

    // Get the legal geo type
    const city = await
            this.legalGeoTypeModel.getByName(
              prisma,
              BaseDataTypes.cityLegalGeoType)

    // Create the legal-geo entity
    const cityLegalGeo = await
            this.legalGeoModel.upsert(
              prisma,
              undefined,  // id
              undefined,  // parentId,
              city.id,
              undefined,  // country2LetterCode
              BaseDataTypes.cityTemplateLegalGeoName,
              undefined,  // emoji
              undefined)  // sourceDataId

    // Create the instance
    const instance = await
            this.instanceModel.upsert(
              prisma,
              undefined,  // id
              undefined,  // parentId
              BaseDataTypes.templateInstanceType,
              BaseDataTypes.politicalPartyOrgType,
              BaseDataTypes.activeStatus,
              cityLegalGeo.id,
              englishLang.id,
              BaseDataTypes.writeAccessType,  // publicAccess
              userProfile.id,
              BaseDataTypes.cityTemplateInstanceName)

    // Setup common instance data
    await this.orgCommonRecommendedDataSetup.setup(
            prisma,
            instance,
            userProfile)

    // Setup common news article topics/queries
    await this.politicalNewsQueries.setup(
            prisma,
            instance.id)
  }

  async setupCountryTemplate(
          prisma: any,
          englishLang: any,
          userProfile: any) {

    // Debug
    const fnName = `${this.clName}.setupCountryTemplate()`

    console.log(`${fnName}: starting..`)

    // Get the legal geo type
    const country = await
            this.legalGeoTypeModel.getByName(
              prisma,
              BaseDataTypes.countryLegalGeoType)

    // Create the legal-geo entity
    const countryLegalGeo = await
            this.legalGeoModel.upsert(
              prisma,
              undefined,  // id
              undefined,  // parentId,
              country.id,
              undefined,  // country2LetterCode
              BaseDataTypes.countryTemplateLegalGeoName,
              undefined,  // emoji
              undefined)  // sourceDataId

    // Create the instance
    const instance = await
            this.instanceModel.upsert(
              prisma,
              undefined,  // id
              undefined,  // parentId
              BaseDataTypes.templateInstanceType,
              BaseDataTypes.politicalPartyOrgType,
              BaseDataTypes.activeStatus,
              countryLegalGeo.id,
              englishLang.id,
              BaseDataTypes.writeAccessType,  // publicAccess
              userProfile.id,
              BaseDataTypes.countryTemplateInstanceName)

    // Setup common instance data
    await this.orgCommonRecommendedDataSetup.setup(
            prisma,
            instance,
            userProfile)

    // Setup common news article topics/queries
    await this.politicalNewsQueries.setup(
            prisma,
            instance.id)
  }

  async setup(
          prisma: any,
          englishLang: any,
          userProfile: any) {

    // Debug
    const fnName = `${this.clName}.setup()`

    console.log(`${fnName}: starting..`)

    // Validate
    if (englishLang == null) {
      throw new CustomError(`${fnName}: englishLang == null`)
    }

    if (userProfile == null) {
      throw new CustomError(`${fnName}: userProfile == null`)
    }

    // Setup political party template data
    await this.setupCityTemplate(
            prisma,
            englishLang,
            userProfile)

    await this.setupCountryTemplate(
            prisma,
            englishLang,
            userProfile)
  }
}
