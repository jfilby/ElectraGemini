import { prisma } from '@/db'
import { CustomError } from '@/serene-core-server/types/errors'
import { InstanceService } from '@/services/instances/service'

// Services
const instanceService = new InstanceService()

// Code
export async function filterInstances(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  const fnName = `filterInstances()`

  // console.log(`${fnName}: args: ` + JSON.stringify(args))

  var results: any

  try {
    results = await
      instanceService.getInstancesByParentId(
        prisma,
        args.orgType,
        args.instanceType,
        args.parentId,
        args.status,
        args.userProfileId,
        true)  // verifyAccess
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

  // Return
  return results.instances
}

export async function instanceById(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  const fnName = `instanceById()`

  // console.log(`${fnName}: args: ` + JSON.stringify(args))

  var results: any

  try {
    results = await
      instanceService.getInstanceById(
        prisma,
        args.id,
        args.userProfileId,
        args.includeStats,
        true)  // verifyAccess
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

  // Debug
  // console.log(`${fnName}: results: ` + JSON.stringify(results))

  // Return
  return results.instance
}

export async function instanceOptions(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  const fnName = `instanceOptions()`

  // console.log(`${fnName}: args: ` + JSON.stringify(args))

  var results: any

  try {
    results = await
      instanceService.getInstanceOptions(
        prisma,
        args.userProfileId)
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

  // Debug
  // console.log(`${fnName}: results: ` + JSON.stringify(results))

  // Return
  return results
}

export async function instanceSharedGroups(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  const fnName = `instanceSharedGroups()`

  // console.log(`${fnName}: args: ` + JSON.stringify(args))

  ;
}

export async function instancesSharedPublicly(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  const fnName = `instancesSharedPublicly()`

  // console.log(`${fnName}: args: ` + JSON.stringify(args))

  ;
}
