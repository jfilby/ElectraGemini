import { prisma } from '@/db'
import { CustomError } from '@/serene-core-server/types/errors'
import { UsersService } from '@/serene-core-server/services/users/service'
import { BaseDataTypes } from '@/types/base-data-types'
import { LangModel } from '@/models/lang/lang-model'
import { InstanceService } from '@/services/instances/service'

// Services
const instanceService = new InstanceService()
const langModel = new LangModel()
const usersService = new UsersService()

// Code
export async function cloneInstance(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  const fnName = `cloneInstance()`

  // console.log(`${fnName}: args: ` + JSON.stringify(args))

  ;
}

export async function deleteInstance(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  const fnName = `deleteInstance()`

  // console.log(`${fnName}: args: ` + JSON.stringify(args))

  ;
}

export async function deleteInstanceSharedPublicly(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  const fnName = `deleteInstanceSharedPublicly()`

  // console.log(`${fnName}: args: ` + JSON.stringify(args))

  ;
}

export async function upsertInstance(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  const fnName = `upsertInstance()`

  console.log(`${fnName}: args: ` + JSON.stringify(args))

  // Verify that the user is signed-in
  const signedInUserProfile = await
          usersService.verifySignedInUserProfileId(
            prisma,
            args.userProfileId)

  if (signedInUserProfile === false) {

    return {
      status: false,
      message: `You need to be signed-in to create/update instances.`
    }
  }

  // instanceType will be Real (editable)
  const instanceType = BaseDataTypes.realInstanceType

  // orgType is only political for now
  const orgType = BaseDataTypes.politicalPartyOrgType

  // Get defaultLangId
  const defaultLang = await
          langModel.getByIso639_2Code(
            prisma,
            BaseDataTypes.english3LetterCode)

  if (defaultLang == null) {
    return {
      status: false,
      message: `Unable to locate English language record`
    }
  }

  // Upsert issue
  var results: any

  await prisma.$transaction(async (transactionPrisma) => {

    try {
      results = await
        instanceService.upsert(
          transactionPrisma,
          args.id,
          instanceType,
          orgType,
          args.status,
          args.legalGeoId,
          defaultLang.id,
          args.userProfileId,
          args.name)
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
  })

  // Return
  console.log(`${fnName}: results: ` + JSON.stringify(results))

  return results
}

export async function upsertInstanceSharedPublicly(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  const fnName = `upsertInstanceSharedPublicly()`

  // console.log(`${fnName}: args: ` + JSON.stringify(args))

  ;
}
