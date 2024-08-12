const fs = require('fs')
import { CustomError } from '@/serene-core-server/types/errors'
import { BaseDataTypes } from '@/types/base-data-types'
import { LegalGeoModel } from '@/models/legal-geos/legal-geo-model'
import { LegalGeoTypeModel } from '@/models/legal-geos/legal-geo-type-model'

export class LoadGeoLocationDataService {

  // Consts
  clName = 'LoadGeoLocationDataService'

  // Models
  legalGeoModel = new LegalGeoModel()
  legalGeoTypeModel = new LegalGeoTypeModel()

  // Code
  async load(prisma: any) {

    // Debug
    const fnName = `${this.clName}.load()`

    // Get country legal geo type
    const countryLegalGeoType = await
            this.legalGeoTypeModel.getByName(
              prisma,
              BaseDataTypes.countryLegalGeoType)

    // Check if countries data already loaded
    const countriesCount = await
            this.legalGeoModel.count(
              prisma,
              countryLegalGeoType.id)

    /* if (countriesCount > 100) {
      return
    } */

    // Paths
    const dataPath = `${process.env.NEXT_PUBLIC_NEXTJS_SRC_PATH}/../data/`
    const countriesFilename = `${dataPath}/geo-location/countries.json`

    // Load countries JSON
    const countriesJsonStr = fs.readFileSync(countriesFilename, 'utf-8')
    const countriesJson = JSON.parse(countriesJsonStr)

    // Upsert countries data
    for (const countryJson of countriesJson) {

      // Validate
      if (countryJson.iso2 == null ||
          countryJson.name == null) {

        throw new CustomError(`${fnName}: invalid country JSON: ` +
                              JSON.stringify(countryJson))
      }

      // Upsert
      await this.legalGeoModel.upsert(
              prisma,
              undefined,         // id
              undefined,         // parentId
              countryLegalGeoType.id,
              countryJson.iso2,  // country2LetterCode
              countryJson.name,
              countryJson.emoji,
              String(countryJson.id))
    }
  }
}
