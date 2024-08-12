const fs = require('fs')
import Web3 from 'web3'
import { CustomError } from '@/serene-core-server/types/errors'
import { BaseDataTypes } from '@/types/base-data-types'
import { InstanceModel } from '@/models/instances/instance-model'
import { ProposalModel } from '@/models/proposals/proposal-model'
import { ProposalPublishedModel } from '@/models/proposals/proposal-published-model'
import { VoteModel } from '@/models/voting/vote-model'
import { VotePublishQueueModel } from '@/models/voting/vote-publish-queue-model'
import { CommonVotingSmartContractService } from './common-service'

export class InteractVotingSmartContractService {

  // Consts
  clName = 'InteractVotingSmartContractService'

  // Models
  instanceModel = new InstanceModel()
  proposalModel = new ProposalModel()
  proposalPublishedModel = new ProposalPublishedModel()
  voteModel = new VoteModel()
  votePublishQueueModel = new VotePublishQueueModel()

  // Services
  common = new CommonVotingSmartContractService()

  // Code
  async callAddProposalMethod(
          web3: Web3,
          defaultAccount: string,
          contract: any,
          proposalId: string,
          instanceId: string,
          name: string) {

    // Debug
    const fnName = `${this.clName}.callAddProposalMethod()`

    console.log(`${fnName}: starting..`)

    // Validate
    if (web3 == null) {
      throw new CustomError(`${fnName}: web3 == null`)
    }

    if (defaultAccount == null) {
      throw new CustomError(`${fnName}: defaultAccount == null`)
    }

    if (contract == null) {
      throw new CustomError(`${fnName}: contract == null`)
    }

    if (proposalId == null) {
      throw new CustomError(`${fnName}: proposalId == null`)
    }

    if (instanceId == null) {
      throw new CustomError(`${fnName}: instanceId == null`)
    }

    if (name == null) {
      throw new CustomError(`${fnName}: name == null`)
    }

    // Estimate gas qty and price
    const gas = await
            contract.methods.addProposal(
              proposalId,
              instanceId,
              name)
              .estimateGas({
                from: defaultAccount
              })

    const gasPrice = await web3.eth.getGasPrice()

    // Call the vote method
    try {
      const proposalResult = await
              contract.methods
                .addProposal(
                  proposalId,
                  instanceId,
                  name)
                .send({
                  from: defaultAccount,
                  gas: gas.toString(),
                  gasPrice: gasPrice.toString()
                })

      console.log(`${fnName}: proposalResult: ${JSON.stringify(proposalResult)}`)

      // Return
      return {
        status: true,
        proposalResult: proposalResult
      }

    } catch(error: any) {
      console.error('Voting failed:', error)
      throw new CustomError(`${fnName}: voting failed: ${error}`)
    }
  }

  async callVoteMethod(
          web3: Web3,
          defaultAccount: string,
          contract: any,
          userProfileId: string,
          proposalId: string,
          voteOption: boolean) {

    // Debug
    const fnName = `${this.clName}.callVoteMethod()`

    console.log(`${fnName}: starting..`)

    // Validate
    if (web3 == null) {
      throw new CustomError(`${fnName}: web3 == null`)
    }

    if (defaultAccount == null) {
      throw new CustomError(`${fnName}: defaultAccount == null`)
    }

    if (contract == null) {
      throw new CustomError(`${fnName}: contract == null`)
    }

    if (userProfileId == null) {
      throw new CustomError(`${fnName}: userProfileId == null`)
    }

    if (proposalId == null) {
      throw new CustomError(`${fnName}: proposalId == null`)
    }

    if (voteOption == null) {
      throw new CustomError(`${fnName}: voteOption == null`)
    }

    // Estimate gas qty and price
    const gas = await
            contract.methods.vote(
              userProfileId,
              proposalId)
              .estimateGas({
                from: defaultAccount
              })

    const gasPrice = await web3.eth.getGasPrice()

    // Call the vote method
    try {
      const voteResult = await
              contract.methods
                .vote(
                  userProfileId,
                  proposalId,
                  voteOption)
                .send({
                  from: defaultAccount,
                  gas: gas.toString(),
                  gasPrice: gasPrice.toString()
                })

      console.log(`${fnName}: voteResult: ${JSON.stringify(voteResult)}`)

      // Return
      return {
        status: true,
        message: undefined,
        voteResult: voteResult
      }

    } catch(error: any) {
      console.error('Voting failed:', error)
      throw new CustomError(`${fnName}: voting failed: ${error}`)
    }
  }

  async getAccountAndContractDetails(web3: Web3) {

    // Debug
    const fnName = `${this.clName}.getAccountAndContractDetails()`

    console.log(`${fnName}: starting..`)

    // Read the deployed address
    const contractAddress =
            fs.readFileSync(
              this.common.deployedAddressFilename,
              'utf8')

    // Read the ABI
    const abiJson =
            fs.readFileSync(
              this.common.abiFilename,
              'utf8')

    const abi = JSON.parse(abiJson)

    // Source the contract
    const contract = new web3.eth.Contract(abi, contractAddress)
    contract.handleRevert = true

    // Get account
    const accounts = await web3.eth.getAccounts()
    const defaultAccount = accounts[0]

    // Return
    console.log(`${fnName}: returning..`)

    return {
      defaultAccount: defaultAccount,
      contract: contract
    }
  }

  async publishAllVotes(prisma: any) {

    // Debug
    const fnName = `${this.clName}.publishAllVotes()`

    console.log(`${fnName}: starting..`)

    // Get all instances
    const instances = await
            this.instanceModel.filter(
              prisma,
              undefined,  // parentId
              undefined,  // orgType
              undefined,  // instanceType
              undefined,  // status
              undefined)  // publicAccess

    // Publish votes per instance
    for (const instance of instances) {

      await this.publishAllInstanceVotes(
              prisma,
              instance.id)
    }
  
    // Return
    return {
      status: true
    }
  }

  async publishAllInstanceVotes(
          prisma: any,
          instanceId: string) {

    // Debug
    const fnName = `${this.clName}.publishAllInstanceVotes()`

    console.log(`${fnName}: starting with instanceId: ${instanceId}`)

    // Connect to the network
    const web3 = this.common.connect()

    // Get account and contract details
    const accountAndContract = await
            this.getAccountAndContractDetails(
              web3)

    // Get all votes
    const votes = await
            this.voteModel.filter(
              prisma,
              instanceId,
              undefined,  // voteObjectId
              undefined,  // userProfileId
              undefined,
              undefined,
              undefined,
              undefined,
              true)       // includeVoteObject

    // Loop through all votes
    for (const vote of votes) {

      // Ensure the object voted on is a proposal
      if (vote.voteObject.refModel !== BaseDataTypes.proposalModel) {
        continue
      }

      // Determine voteOption
      var voteOption = false

      if (vote.voteType.toLowerCase() === 'y') {
        voteOption = true
      }

      // First publish the proposal if needed
      await this.publishProposal(
              prisma,
              vote.voteObject.refId)  // proposalId

      // Call the vote method
      const result = await
              this.callVoteMethod(
                web3,
                accountAndContract.defaultAccount,
                accountAndContract.contract,
                vote.userProfileId,
                vote.voteObject.refId,
                voteOption)
    }
  }

  async publishPending(prisma: any) {

    // Debug
    const fnName = `${this.clName}.publishPending()`

    // Get pending vote ids to publish
    const pendingVotes = await
            this.votePublishQueueModel.filter(
              prisma,
              undefined)  // instanceId

    console.log(`${fnName}: publishing ${pendingVotes.length} votes..`)

    // Publish each vote
    for (const pendingVote of pendingVotes) {

      // Publish the vote
      const results = await
              this.publishVote(
                prisma,
                pendingVote.vote.userProfileId,
                pendingVote.vote.voteObject.refId,
                pendingVote.vote.voteOption)

      if (results.status === false) {
        console.log(`${fnName}: publishVote(): ${results.message}`)
      }
    }

    // Return
    console.log(`${fnName}: returning..`)

    return {
      status: true
    }
  }

  async publishProposal(
          prisma: any,
          proposalId: string) {

    // Debug
    const fnName = `${this.clName}.publishProposal()`

    // Has the proposal been published?
    const proposalPublishedExists = await
            this.proposalPublishedModel.exists(
              prisma,
              proposalId)

    if (proposalPublishedExists === true) {
      return {
        status: true
      }
    }

    // Get the proposal
    const proposal = await
            this.proposalModel.getById(
              prisma,
              proposalId)

    // Connect to the network
    const web3 = this.common.connect()

    // Get account and contract details
    const accountAndContract = await
            this.getAccountAndContractDetails(
              web3)

    console.log(`${fnName}: defaultAccount: ` +
                JSON.stringify(accountAndContract.defaultAccount))

    // Call the vote method
    const result = await
            this.callAddProposalMethod(
              web3,
              accountAndContract.defaultAccount,
              accountAndContract.contract,
              proposal.id,
              proposal.instanceId,
              proposal.name)

    // Save as publish
    const proposalPublished = await
            this.proposalPublishedModel.create(
              prisma,
              proposal.instanceId,
              proposal.id)

    // Return
    return result
  }

  async publishVote(
          prisma: any,
          userProfileId: string,
          proposalId: string,
          voteOption: boolean) {

    // Debug
    const fnName = `${this.clName}.publishVote()`

    // Connect to the network
    const web3 = this.common.connect()

    // Get account and contract details
    const accountAndContract = await
            this.getAccountAndContractDetails(
              web3)

    // First publish the proposal if needed
    await this.publishProposal(
            prisma,
            proposalId)

    // Call the vote method
    const result = await
            this.callVoteMethod(
              web3,
              accountAndContract.defaultAccount,
              accountAndContract.contract,
              userProfileId,
              proposalId,
              voteOption)

    // Return
    return result
  }
}
