import { CustomError } from '@/serene-core-server/types/errors'
import { BaseDataTypes } from '@/types/base-data-types'
import { InstanceModel } from '@/models/instances/instance-model'
import { KbFileModel } from '@/models/kb/kb-file-model'

export class TestsService {

  // Consts
  clName = 'TestsService'

  // Models
  instanceModel = new InstanceModel()
  kbFileModel = new KbFileModel()

  // Code
  async run(prisma: any) {

    // Debug
    const fnName = `${this.clName}.run()`

    // Get instances
    const instances = await
            this.instanceModel.filter(
              prisma,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined)

    // Test KB relevant for generating
    /* for (const instance of instances) {

      await this.testKbRelevantForGenerating(
              prisma,
              instance.id)
    } */
  }
}
