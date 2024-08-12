import { BaseDataTypes } from '@/types/base-data-types'
import { InstanceModel } from '@/models/instances/instance-model'
import { LangModel } from '@/models/lang/lang-model'
import { LegalGeoModel } from '@/models/legal-geos/legal-geo-model'
import { LegalGeoTypeModel } from '@/models/legal-geos/legal-geo-type-model'
import { OrgCommonRecommendedDataSetup } from '../../instance-templates/org-common'
import { PoliticalNewsQueries } from '../../instance-templates/political-news-queries'

export class UsaPartyDemoSetupService {

  // Consts
  clName = 'UsaPartyDemoSetupService'

  // Models
  instanceModel = new InstanceModel()
  legalGeoModel = new LegalGeoModel()
  legalGeoTypeModel = new LegalGeoTypeModel()
  langModel = new LangModel()

  // Services
  orgCommonRecommendedDataSetup = new OrgCommonRecommendedDataSetup()
  politicalNewsQueries = new PoliticalNewsQueries()

  // Code
  async setup(
          prisma: any,
          englishLang: any,
          userProfile: any) {

    // Get the legal geo type
    const country = await
            this.legalGeoTypeModel.getByName(
              prisma,
              BaseDataTypes.countryLegalGeoType)

    // Get the legal-geo country record
    const usaLegalGeo = await
            this.legalGeoModel.getByUniqueKey(
              prisma,
              undefined,  // parentId,
              BaseDataTypes.usaCountryName)

    // Create the instance
    const instance = await
            this.instanceModel.upsert(
              prisma,
              undefined,  // id
              undefined,  // parentId
              BaseDataTypes.demoInstanceType,
              BaseDataTypes.politicalPartyOrgType,
              BaseDataTypes.activeStatus,
              usaLegalGeo.id,
              englishLang.id,
              BaseDataTypes.writeAccessType,  // publicAccess
              userProfile.id,
              BaseDataTypes.electraAiPartyForUsa)

    // Setup common instance data
    // This will eventually be replaced by cloning template instances
    await this.orgCommonRecommendedDataSetup.setup(
            prisma,
            instance,
            userProfile)

    // Setup common news article topics/queries
    await this.politicalNewsQueries.setup(
            prisma,
            instance.id)
  }
}
