export class BatchTypes {

  // Batch job statuses
  static activeBatchJobStatus = 'A'
  static completedBatchJobStatus = 'C'
  static failedBatchJobStatus = 'F'
  static newBatchJobStatus = 'N'

  // Batch job names
  static deployVotingSmartContractJob = 'deployVotingSmartContract'
  static publishPendingVotesJob = 'publishPendingVotes'
  static buildKbExtractsJob = 'buildKbExtracts'

  // Ref models
  static kbFileContentModel = 'KbFileContentModel'
}
