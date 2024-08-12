import { CustomError } from '@/serene-core-server/types/errors'
import { CachedEmbeddingModel } from '@/serene-ai-server/models/cache/cached-embedding-model'
import { GoogleVertexEmbeddingService } from '@/serene-ai-server/services/llm-apis/google-gemini/embedding-api'
import { BaseDataTypes } from '@/types/base-data-types'
import { KbFileTypes } from '@/types/kb-file-types'
import { InstanceModel } from '@/models/instances/instance-model'
import { KbFileContentModel } from '@/models/kb/kb-file-content-model'
import { KbFileModel } from '@/models/kb/kb-file-model'
import { KbPathService } from './kb-path-service'
import { InstanceService } from '../instances/service'
import { SnippetService } from '@/serene-ai-server/services/content/snippet-service'

export class KbFileService {

  // Consts
  clName = 'KbFileService'

  // Models
  cachedEmbeddingModel = new CachedEmbeddingModel()
  instanceModel = new InstanceModel()
  kbFileContentModel = new KbFileContentModel()
  kbFileModel = new KbFileModel()

  // Services
  googleVertexEmbeddingService = new GoogleVertexEmbeddingService()
  instanceService = new InstanceService()
  kbPathService = new KbPathService()
  snippetService = new SnippetService()

  // Code
  async existsByParentIdAndName(
          prisma: any,
          parentId: string,
          instanceId: string,
          name: string,
          userProfileId: string,
          refModel: string,
          verifyAccess: boolean) {

    // Debug
    const fnName = `${this.clName}.existsByParentIdAndName()`

    // Doesn't apply if refModel is not null
    if (refModel != null) {
      throw new CustomError(
                  `${fnName}: can't check uniqueness if refModel isn't null`)
    }

    // Check for access rights if parentId specified
    if (verifyAccess === true &&
        parentId != null) {

      const hasReadAccess = await
              this.getAccessToRead(
                prisma,
                instanceId,
                userProfileId)
                // undefined,  // kbFile
                // parentId)

      if (hasReadAccess.status === false) {
        return hasReadAccess
      }
    }

    // Check if record exists
    const kbFile = await
            this.kbFileModel.getByParentIdAndInstanceIdAndName(
              prisma,
              parentId,
              instanceId,
              name)

    // Not found
    if (kbFile == null) {

      return {
        status: true,
        found: false
      }
    }

    // Return found
    return {
      status: true,
      found: true
    }
  }

  async deleteById(
          prisma: any,
          kbFileId: string,
          instanceId: string,
          userProfileId: string,
          verifyAccess: boolean) {

    // Verify access
    if (verifyAccess === true &&
        kbFileId != null) {

      const hasWriteAccess = await
              this.getAccessToWrite(
                prisma,
                instanceId,
                userProfileId)
                // undefined,  // kbFile
                // kbFileId)

      if (hasWriteAccess.status === false) {
        return hasWriteAccess
      }
    }

    // Cascading delete
    await this.kbFileModel.deleteCascadeById(
            prisma,
            kbFileId,
            instanceId)

    // Return
    return {
      status: true
    }
  }

  async deleteByIds(
          prisma: any,
          kbFileIds: string[],
          instanceId: string,
          userProfileId: string,
          verifyAccess: boolean) {

    // Iterate, checking the access of each file
    for (const kbFileId of kbFileIds) {

      const results = await
              this.deleteById(
                prisma,
                kbFileId,
                instanceId,
                userProfileId,
                verifyAccess)

      if (results.status === false) {
        return results
      }
    }

    // Return
    return {
      status: true
    }
  }

  async generateTextEmbedding(text: string) {

    // Debug
    const fnName = `${this.clName}.generateTextEmbedding()`

    // Make a call to the Google embeddings service
    const embedding = await
            this.googleVertexEmbeddingService.requestEmbedding(text)

    // Return the embedding
    return embedding
  }

  async generateEmbeddingsForInstance(
          prisma: any,
          instanceId: string) {

    // Debug
    const fnName = `${this.clName}.generateEmbeddingsForInstance()`

    // Get a list of records to generate embeddings for
    const kbFiles = await
            this.kbFileModel.getByRefreshEmbeddingsNeeded(
              prisma,
              instanceId)

    // Debug
    console.log(`${fnName}: generating embeddings for ${kbFiles.length} ` +
                `records for instanceId: ${instanceId}`)

    // Generate and save embeddings for each record
    for (const kbFile of kbFiles) {

      // Get KbFileContent record
      const kbFileContent = await
              this.kbFileContentModel.getByKbFileId(
                prisma,
                kbFile.id)

      // Validate
      if (kbFileContent == null) {
        console.warn(`${fnName}: kbFileContent == null for kbFileId: ` +
                     JSON.stringify(kbFile.id) +
                    `; setting refreshEmbedding to false`)

        // Update KbFile and set refreshEmbedding to false
        await this.kbFileModel.update(
                prisma,
                kbFile.id,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                false)  // refreshEmbedding

        // Continue the loop
        continue
      }

      // Embedding var
      var embedding: any

      // Is an embedding needed?
      if (kbFileContent.text == null ||
          kbFileContent.text.trim() === '') {

        embedding = null
      } else {
        // Generate an embedding
        const embeddingResults = await
          this.generateTextEmbedding(`${kbFile.name}: ${kbFileContent.text}`)

        if (embeddingResults.status === false) {
          return embeddingResults
        }

        embedding = embeddingResults.embedding.values
      }

      // Save the embedding
      await this.kbFileModel.setEmbedding(
              prisma,
              kbFile.id,
              embedding)
    }

    // Debug
    console.log(`${fnName}: returning..`)
  }

  async generateEmbeddings(prisma: any) {

    // Debug
    const fnName = `${this.clName}.generateEmbeddings()`

    // Get all instances
    const instances = await
            this.instanceModel.filter(
              prisma,
              undefined,  // parentId
              undefined,  // orgType
              undefined,  // instanceType
              undefined,  // status
              undefined)  // publicAccess

    // Generate embeddings per instance
    for (const instance of instances) {

      await this.generateEmbeddingsForInstance(
              prisma,
              instance.id)
    }
  }

  async getAccessToRead(
          prisma: any,
          instanceId: string,
          userProfileId: string
          /* kbFile: any,
          kbFileId: string */) {

    return await this.getAccess(
             prisma,
             instanceId,
             userProfileId)
             // BaseDataTypes.writeAccessType,
             // kbFile,
             // kbFileId)
  }

  async getAccessToWrite(
          prisma: any,
          instanceId: string,
          userProfileId: string,
          /* kbFile: any,
          kbFileId: string */) {

    return await this.getAccess(
             prisma,
             instanceId,
             userProfileId,
             /* BaseDataTypes.readAccessType,
             kbFile,
             kbFileId */)
  }

  async getAccess(
          prisma: any,
          instanceId: string,
          userProfileId: string /* ,
          accessType: string,
          kbFile: any = undefined,
          kbFileId: string | undefined = undefined */) {

    // Go on the instance access
    const instanceAccessResults = await
            this.instanceService.getAccessToWrite(
              prisma,
              userProfileId,
              undefined,  // instance
              instanceId)

    return instanceAccessResults

    /* Debug
    const fnName = `${this.clName}.getAccessToWrite()`

    // Validation
    if (kbFile == null &&
        kbFileId == null) {

      throw new CustomError(
                  `${fnName}: Neither kbFile nor kbFileId specified`)
    }

    // If no kbFile given, then get by id
    if (kbFile == null &&
        kbFileId != null) {

      kbFile = await
        this.kbFileModel.getById(
          prisma,
          kbFileId)
    }

    // Verify
    if (kbFile.createdById !== userProfileId) {

      if (accessType === 'R' &&
          kbFile.publicAccess !== 'R' &&
          kbFile.publicAccess !== 'W') {

        return {
          status: false,
          message: `read access denied`
        }
      }

      if (accessType === 'W' &&
          kbFile.publicAccess !== 'W') {

        return {
          status: false,
          message: `write access denied`
        }
      }
    }

    // Return
    return {
      status: true
    } */
  }

  async getById(
          prisma: any,
          id: string,
          instanceId: string,
          userProfileId: string,
          includeAcl: boolean,
          includeFolderFiles: boolean,
          includeFolderBreadcrumbs: boolean,
          verifyAccess: boolean) {

    // Debug
    const fnName = `${this.clName}.getById()`

    console.log(`${fnName}: starting with id: ${id}`)

    // Initial validation
    if (instanceId == null) {
      throw new CustomError(`${fnName}: instanceId == null`)
    }

    // If id is null then get the root id
    if (id == null) {

      // console.log(`${fnName}: getting rootKbFile for instanceId: ${instanceId}`)

      const rootKbFiles = await
              this.kbFileModel.getByParentIdAndInstanceId(
                prisma,
                null,  // parentId
                instanceId)

      // console.log(`${fnName}: rootKbFiles: ${rootKbFiles.length}`)

      if (rootKbFiles.length === 0) {
        throw new CustomError(`${fnName}: no root file for instance`)
      }

      id = rootKbFiles[0].id
    }

    // Debug
    // console.log(`${fnName}: secondary validation with id: ${id}`)

    // Secondary validation (root id should now be retrievied if id was == null)
    if (id == null &&
        includeAcl === true) {

      throw new CustomError(`${fnName}: id == null and includeAcl === true`)
    }

    // Verify access
    var hasReadAccess = true

    if (verifyAccess === true &&
        id != null) {

      // console.log(`${fnName}: verifying read access..`)

      const hasReadAccessResults = await
              this.getAccessToRead(
                prisma,
                instanceId,
                userProfileId)
                // undefined,  // kbFile
                // id)

      if (hasReadAccessResults.status === false) {

        console.error(`${fnName}: ${hasReadAccessResults.message}`)

        return {
          status: false,
          message: hasReadAccessResults.message,
          found: false
        }
      }

      hasReadAccess = hasReadAccessResults.status
    }

    // Vars
    var status = true
    var found = false
    var kbFile: any = null
    var folderFiles: any[] | null = null
    var folderBreadcrumbs: any[] | undefined

    // Get record if id is specified
    // console.log(`${fnName}: get kbFile for id: ${id}`)

    if (id != null) {

      kbFile = await
        this.kbFileModel.getById(
          prisma,
          id)

      if (kbFile != null) {
        found = true
      }
    }

    // includeAcl
    if (includeAcl === true) {

      const hasWriteAccessResults = await
              this.getAccessToWrite(
                prisma,
                instanceId,
                userProfileId)
                // kbFile
                // id)

      kbFile.acl = {
        read: hasReadAccess,
        write: hasWriteAccessResults.status
      }
    }

    // includeFolderFiles
    if (includeFolderFiles === true) {

      folderFiles = await
          this.kbFileModel.getByParentIdAndInstanceId(
            prisma,
            id,
            instanceId)
    }

    // includeFolderBreadcrumbs
    if (includeFolderBreadcrumbs === true) {

      folderBreadcrumbs = await
        this.kbPathService.getPathIdsAndNames(
          prisma,
          id)
    }

    // Return
    // console.log(`${fnName}: returning..`)

    return {
      status: status,
      found: found,
      kbFile: kbFile,
      folderFiles: folderFiles,
      folderBreadcrumbs: folderBreadcrumbs
    }
  }

  async search(
          prisma: any,
          instanceId: string,
          userProfileId: string,
          status: string,
          input: string,
          page: number,
          verifyAccess: boolean) {

    // Debug
    const fnName = `${this.clName}.search()`

    // Verify access
    if (verifyAccess === true) {

      const hasReadAccess = await
              this.instanceService.getAccessToRead(
                prisma,
                userProfileId,
                undefined,  // instance
                instanceId)

      if (hasReadAccess.status === false) {
        return {
          status: false,
          message: hasReadAccess.message,
          kbFile: undefined
        }
      }
    }

    // Get or generate an embedding for the input
    var inputEmbedding: any
    input = input.trim()

    const cachedEmbedding = await
            this.cachedEmbeddingModel.getByText(
              prisma,
              input)

    if (cachedEmbedding != null) {

      inputEmbedding = cachedEmbedding.embedding
    } else {
      // Generate an embedding
      const inputEmbeddingResults = await
              this.generateTextEmbedding(input)

      if (inputEmbeddingResults.status === false) {
        return inputEmbeddingResults
      }

      inputEmbedding = inputEmbeddingResults.embedding.values

      // Save the embedding
      await this.cachedEmbeddingModel.create(
              prisma,
              input,
              inputEmbedding)
    }

    // Get records
    const kbResultsFiles = await
            this.kbFileModel.searchEmbeddings(
              prisma,
              instanceId,
              status,
              inputEmbedding,
              null,       // refModel
              page,
              KbFileTypes.searchPageSize)

    // Debug
    // console.log(`${fnName}: kbResultsFiles: ` + JSON.stringify(kbResultsFiles))
    console.log(`${fnName}: kbFiles: ${kbResultsFiles.kbFiles.length}`)

    // Get KbFileContent and Issue records
    var results: any[] = []

    for (const kbResultsFile of kbResultsFiles.kbFiles) {

      // Get KbFile
      const kbFile = await
              this.kbFileModel.getById(
                prisma,
                kbResultsFile.id,
                true)  // includeKbFileContent

      // Skip kbFiles without content
      if (kbFile.kbFileContent == null) {

        console.warn(`${fnName}: skipping result with null content`)
        continue
      }

      // Get a snippet of the text
      kbFile.snippet = this.snippetService.getSnippet(kbFile.kbFileContent.text)

      // Add to results
      results.push({
        kbFile: kbFile
      })
    }

    // Return
    return {
      status: true,
      results: results,
      hasMore: kbResultsFiles.hasMore
    }
  }

  async upsertFile(
          prisma: any,
          kbFileId: string | undefined,
          parentId: string | undefined,
          instanceId: string,
          publicAccess: string | null | undefined,
          refModel: string | null | undefined,
          format: string,
          name: string,
          tags: string[] | undefined,
          userProfileId: string,
          verifyAccess: boolean) {

    // Verify access
    if (verifyAccess === true &&
        kbFileId != null) {

      const hasWriteAccess = await
              this.getAccessToWrite(
                prisma,
                instanceId,
                userProfileId)
                // undefined,  // kbFile
                // kbFileId)

      if (hasWriteAccess.status === false) {
        return {
          status: false,
          message: hasWriteAccess.message,
          kbFile: undefined
        }
      }
    }

    // Handle undefined tags for a new record
    if (kbFileId == null &&
        tags == null) {

      tags = []
    }

    // Upsert record
    const kbFile = await
            this.kbFileModel.upsert(
              prisma,
              kbFileId,
              parentId,
              instanceId,
              userProfileId,
              undefined,  // defaultAssignedToId
              undefined,  // taskId
              publicAccess,
              refModel,
              BaseDataTypes.activeStatus,
              format,
              name,
              tags,
              false)  // refreshEmbedding

    // Return
    return {
      status: true,
      kbFile: kbFile
    }
  }

  async upsertFolder(
          prisma: any,
          kbFileId: string | undefined,
          parentId: string | null | undefined,
          instanceId: string,
          userProfileId: string,
          publicAccess: string | null | undefined,
          refModel: string | null | undefined,
          name: string,
          tags: string[] = [],
          verifyAccess: boolean) {

    // Debug
    const fnName = `${this.clName}.upsertFolder()`

    // Verify access
    if (verifyAccess === true &&
        kbFileId != null) {

      var hasWriteAccess = await
            this.getAccessToWrite(
              prisma,
              instanceId,
              userProfileId)
              // undefined,  // kbFile
              // kbFileId)

      if (hasWriteAccess.status === false) {

        return {
          status: false,
          message: hasWriteAccess.message,
          kbFile: undefined
        }
      }
    }

    // Debug
    console.log(`${fnName}: upserting KbFile record with instanceId: ` +
                instanceId)

    // Upsert record
    const kbFile = await
            this.kbFileModel.upsert(
              prisma,
              kbFileId,
              parentId,
              instanceId,
              userProfileId,
              undefined,  // defaultAssignedToId
              undefined,  // taskId
              publicAccess,
              refModel,
              BaseDataTypes.activeStatus,
              KbFileTypes.directoryFormat,
              name,
              tags,
              false)      // refreshEmbedding

    // Return
    return {
      status: true,
      kbFile: kbFile
    }
  }
}
