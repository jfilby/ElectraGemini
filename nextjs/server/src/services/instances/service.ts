const NodeCache = require('node-cache')
import { CustomError } from '@/serene-core-server/types/errors'
import { BaseDataTypes } from '@/types/base-data-types'
import { InstanceModel } from '@/models/instances/instance-model'
import { IssueModel } from '@/models/issues/issue-model'
import { LegalGeoModel } from '@/models/legal-geos/legal-geo-model'
import { LegalGeoTypeModel } from '@/models/legal-geos/legal-geo-type-model'
import { ProposalModel } from '@/models/proposals/proposal-model'

// Cache objects must be global, to access all data (e.g. ability to delete
// an item from an object if InstanceService).
const cachedInstances = new NodeCache()
const cachedInstancesWithIncludes = new NodeCache()

// Class
export class InstanceService {

  // Consts
  clName = 'InstanceService'

  // Models
  instanceModel = new InstanceModel()
  issueModel = new IssueModel()
  legalGeoModel = new LegalGeoModel()
  legalGeoTypeModel = new LegalGeoTypeModel()
  proposalModel = new ProposalModel()

  // Code
  async getAccessToRead(
          prisma: any,
          userProfileId: string,
          instance: any,
          instanceId: string) {

    return await this.getAccess(
             prisma,
             userProfileId,
             BaseDataTypes.writeAccessType,
             instance,
             instanceId)
  }

  async getAccessToWrite(
          prisma: any,
          userProfileId: string,
          instance: any,
          instanceId: string) {

    return await this.getAccess(
             prisma,
             userProfileId,
             BaseDataTypes.readAccessType,
             instance,
             instanceId)
  }

  async getAccess(
          prisma: any,
          userProfileId: string,
          accessType: string,
          instance: any = undefined,
          instanceId: string | undefined = undefined) {

    // Debug
    const fnName = `${this.clName}.getAccessToWrite()`

    // console.log(`${fnName}: accessType: ${accessType} ` +
    //             `instanceId: ${instanceId}`)

    // Validation
    if (instance == null &&
        instanceId == null) {

      throw new CustomError(
                  `${fnName}: Neither instance nor instanceId specified`)
    }

    // If no instance given, then get by id
    if (instance == null &&
        instanceId != null) {

      // Try to get by cache
      if (cachedInstances.has(instanceId)) {

        instance = cachedInstances.get(instanceId)
      } else {

        // Otherwise get from the DB
        instance = await
          this.instanceModel.getById(
            prisma,
            instanceId)

        // Set in the cache
        cachedInstances.set(
          instanceId,
          instance)
      }
    }

    // Verify
    if (instance.createdById !== userProfileId) {

      if (accessType === 'R' &&
          instance.publicAccess !== 'R' &&
          instance.publicAccess !== 'W') {

        return {
          status: false,
          message: `read access denied`
        }
      }

      if (accessType === 'W' &&
          instance.publicAccess !== 'W') {

        return {
          status: false,
          message: `write access denied`
        }
      }
    }

    // Debug
    // console.log(`${fnName}: verified OK`)

    // Return
    return {
      status: true
    }
  }

  async getCountry2LetterCodesByInstanceStatus(
          prisma: any,
          status: string) {

    // Debug
    const fnName = `${this.clName}.getCountry2LetterCodesByInstanceStatus`

    // Get a distinct list of country codes for demo & real instances of the
    // specified status
    const distinctCountry2LetterCodes = await
            this.legalGeoModel.getCountryCodesByInstanceTypesAndStatus(
              prisma,
              [BaseDataTypes.demoInstanceType,
               BaseDataTypes.realInstanceType],
              status)

    // Filter out the country codes only
    const country2LetterCodes: string[] = []

    for (const distinctCountry2LetterCode of distinctCountry2LetterCodes) {

      country2LetterCodes.push(distinctCountry2LetterCode.country2LetterCode)
    }

    // Debug
    // console.log(`${fnName}: country2LetterCodes: ` +
    //             JSON.stringify(country2LetterCodes))

    // Return
    return country2LetterCodes
  }

  async getInstanceById(
          prisma: any,
          id: string | undefined,  // Can be undefined to load options only
          userProfileId: string,
          includeStats: boolean,
          verifyAccess: boolean = false) {

    // Debug
    const fnName = `${this.clName}.getInstanceById()`

    // Check for access rights if parentId specified
    if (verifyAccess === true &&
        id != null) {

      const hasReadAccess = await
              this.getAccessToRead(
                prisma,
                userProfileId,
                undefined,  // instance
                id)

      // Debug
      // console.log(`${fnName}: hasReadAccess: ` + JSON.stringify(hasReadAccess))

      if (hasReadAccess.status === false) {
        return hasReadAccess
      }
    }

    // Get from cache if present. Return here if options and sttats aren't
    // required.
    if (id != null) {

      var instance: any

      if (cachedInstancesWithIncludes.has(id)) {

        instance = cachedInstancesWithIncludes.get(id)

        if (includeStats !== true) {

          return {
            status: true,
            instance: instance
          }
        }
      }

      // Debug
      // console.log(`${fnName}: getting instance..`)

      // Get Instance
      if (instance == null) {

        instance = await
          this.instanceModel.getById(
            prisma,
            id,
            true,  // includeCreatedByUserProfile
            true)  // includeCreatedByUser

        // Set in cache
        cachedInstancesWithIncludes.set(
          id,
          instance)
      }

      // Get stats
      if (includeStats === true) {

        var stats: any = {}

        stats.issuesCount = await
          this.issueModel.countByInstance(
            prisma,
            id)

        stats.proposalsCount = await
          this.proposalModel.countByInstance(
            prisma,
            id)

        instance.stats = stats
      }
    }

    // Debug
    // console.log(`${fnName}: returning with instance: ` +
    //             JSON.stringify(instance))

    // Return
    return {
      status: true,
      instance: instance
    }
  }

  async getInstanceOptions(
          prisma: any,
          userProfileId: string) {

    var options: any = {}

    // Get country legal geo type
    const countryLegalGeoType = await
            this.legalGeoTypeModel.getByName(
              prisma,
              BaseDataTypes.countryLegalGeoType)

    // Get countries
    const countryLegalGeos = await
            this.legalGeoModel.getByLegalGeoType(
              prisma,
              countryLegalGeoType,
              true)  // sortByName

    var countries: any[] = []

    for (const countryLegalGeo of countryLegalGeos) {

      countries.push({
        id: countryLegalGeo.id,
        name: `${countryLegalGeo.emoji} ${countryLegalGeo.name}`
      })
    }

    options.countries = countries

    // Return
    return {
      status: true,
      options: options
    }
  }

  async getInstancesByParentId(
          prisma: any,
          orgType: string,
          instanceType: string,
          parentId: string,
          status: string,
          userProfileId: string,
          verifyAccess: boolean = false) {

    // Debug
    const fnName = `${this.clName}.getInstancesByParentId()`

    // Check for access rights if parentId specified
    if (verifyAccess === true &&
        parentId != null) {

      const hasReadAccess = await
              this.getAccessToRead(
                prisma,
                userProfileId,
                undefined,  // instance
                parentId)

      if (hasReadAccess.status === false) {
        return hasReadAccess
      }
    }

    // Debug
    // console.log(`${fnName}: filtering instances model..`)

    // Filter
    const instances = await
            this.instanceModel.filter(
              prisma,
              parentId,
              orgType,
              instanceType,
              status,
              undefined,  // publicAccess
              true,       // includeCreatedByUserProfile
              true)       // includeCreatedByUser

    // Debug
    // console.log(`${fnName}: returning with instances: ` +
    //             JSON.stringify(instances))

    // Return
    return {
      status: true,
      instances: instances
    }
  }

  async upsert(
          prisma: any,
          id: string | undefined,
          instanceType: string,
          orgType: string,
          status: string,
          legalGeoId: string,
          defaultLangId: string,
          userProfileId: string,
          name: string) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // Validate
    if (name != null) {

      if (name.trim() === '') {
        return {
          status: false,
          message: `You must specify the name of the instance`
        }
      }
    }

    if (legalGeoId != null) {

      if (legalGeoId.trim() === '') {
        return {
          status: false,
          message: `You must specify the location of the instance`
        }
      }
    }

    // Verification checks if the instance already exists
    var instance: any

    if (id != null) {

      instance = await
        this.instanceModel.getById(
          prisma,
          id)

      // Did the user create the instance?
      if (instance.createdById !== userProfileId) {

        return {
          status: false,
          message: `You can't update an instance you didn't create.`
        }
      }

      // Is the instance a real instance type? (not demo or template)
      if (instance.instanceType !== BaseDataTypes.realInstanceType) {

        return {
          status: false,
          message: `This instance isn't of a type you can update.`
        }
      }
    }

    // Upsert the instance record
    instance = await
      this.instanceModel.upsert(
        prisma,
        id,
        undefined,  // parentId
        instanceType,
        orgType,
        status,
        legalGeoId,
        defaultLangId,
        undefined,  // publicAccess
        userProfileId,
        name)

    // Remove the instance from the cache maps
    if (cachedInstances.has(id)) {
      cachedInstances.del(id)
    }

    if (cachedInstancesWithIncludes.has(id)) {
      cachedInstancesWithIncludes.del(id)
    }

    // Check for error
    if (instance == null) {

      return {
        status: false,
        message: 'Failed to create/update instance'
      }
    }

    // Return OK
    return {
      status: true,
      instanceId: instance.id
    }
  }
}
