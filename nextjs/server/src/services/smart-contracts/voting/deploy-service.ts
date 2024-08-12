const fs = require('fs')
const solc = require('solc')
import Web3 from 'web3'
import { CustomError } from '@/serene-core-server/types/errors'
import { CommonVotingSmartContractService } from './common-service'

export class DeployVotingSmartContractService {

  // Consts
  clName = 'DeployVotingSmartContractService'

  // Services
  common = new CommonVotingSmartContractService()

  // Code
  compileContract() {

    // Debug
    const fnName = `${this.clName}.getContract()`

    // Contract source filename
    console.log(`${fnName}: reading contract source file: ` +
                this.common.contractSourceFilename)

    // Read the Solidity contract source code
    const source =
            fs.readFileSync(
              this.common.contractSourceFilename,
              'utf8')

    const contractInput = {
      language: 'Solidity',
      sources: {
        'voting.sol': {
          content: source,
        }
      },
      settings: {
        outputSelection: {
          '*': {
              '*': ['*'],
          }
        }
      }
    }

    // Compile the contract
    const compiledContract = JSON.parse(solc.compile(JSON.stringify(contractInput)))
    const abi = compiledContract.contracts['voting.sol']['Voting'].abi
    const bytecode = compiledContract.contracts['voting.sol']['Voting'].evm.bytecode.object

    // Debug
    console.log(`${fnName}: writing contract ABI (json) file..`)

    // Write the contract ABI to a file
    fs.writeFileSync(
      this.common.abiFilename,
      JSON.stringify(abi, null, '\t'))

    // Debug
    console.log(`${fnName}: writing contract bytecode file..`)

    // Write the contract bytecode to a file
    fs.writeFileSync(
      this.common.bytecodeFilename,
      bytecode)

    // Debug
    console.log(`${fnName}: returning..`)

    // Return
    return {
      compiledContract: compiledContract,
      abi: abi,
      bytecode: bytecode
    }
  }

  async deploy() {

    // Debug
    const fnName = `${this.clName}.deploy()`
  
    console.log(`${fnName}: starting..`)

    // Validate
    if (process.env.NEXT_PUBLIC_NEXTJS_SRC_PATH == null) {
      throw new CustomError(`${fnName}: NEXT_PUBLIC_NEXTJS_SRC_PATH not set`)
    }

    if (process.env.NEXT_PUBLIC_WEB3_NETWORK_URL == null) {
      throw new CustomError(`${fnName}: NEXT_PUBLIC_WEB3_NETWORK_URL not set`)
    }

    if (process.env.NEXT_PUBLIC_WEB3_PRIVATE_KEY == null) {
      throw new CustomError(`${fnName}: NEXT_PUBLIC_WEB3_PRIVATE_KEY not set`)
    }

    // Connect to the network
    const web3 = this.common.connect()

    // Get/validate the chainId
    const chainId = await this.getAndValidateChainId(web3)

    // Compile the smart contract
    const contractData = this.compileContract()

    // Debug
    console.log(`${fnName}: getting account..`)

    // Get account
    const account =
            web3.eth.accounts.privateKeyToAccount(
              process.env.NEXT_PUBLIC_WEB3_PRIVATE_KEY)

    // Debug
    console.log(`${fnName}: adding account..`)

    web3.eth.accounts.wallet.add(account)
    web3.eth.defaultAccount = account.address

    // Debug
    console.log(`${fnName}: reading bytecode: ${this.common.bytecodeFilename}`)

    // Read in the bytecode as a string
    const bytecodeString =
            fs.readFileSync(
              this.common.bytecodeFilename,
              'utf8')

    // Debug
    console.log(`${fnName}: getting requirements for deploying contract..`)

    // Get requirements for deploying contract
    const contract = new web3.eth.Contract(contractData.abi)

    const deployTx = contract.deploy({
      data: '0x' + bytecodeString,
      arguments: []
    })

    const gas = await deployTx.estimateGas()
    const gasPrice = await web3.eth.getGasPrice()

    // Debug
    console.log(`${fnName}: deploying smart contract..`)

    // Deploy
    try {
      const deployedContract = await deployTx.send({
              from: account.address,
              gas: gas.toString(),
              gasPrice: gasPrice.toString()
      })

      const deployedMsg =
              `Contract deployed at: ${deployedContract.options.address}`

      console.log(`${fnName}: ${deployedMsg}`)

      fs.writeFileSync(
        this.common.deployedAddressFilename,
        deployedContract.options.address)

    } catch (error) {
      console.error('Deployment failed:', error)
      throw new CustomError(`${fnName}: deployment failed: ${error}`)
    }

    // Return OK
    return {
      status: true
    }
  }

  async getAndValidateChainId(web3: any) {

    // Debug
    const fnName = `${this.clName}.getAndValidateChainId()`

    // Get the chainId
    web3.eth
      .getChainId()
      .then((chainId: string | bigint) => {
        console.log('Chain Id: ' + chainId)

        // Validate the chainId, if the env var is specified
        if (process.env.NEXT_PUBLIC_WEB3_CHAIN_ID != null &&
            process.env.NEXT_PUBLIC_WEB3_CHAIN_ID !== '') {

          if (typeof(chainId) === 'bigint') {
            chainId = chainId.toString()
          }

          if (chainId !== process.env.NEXT_PUBLIC_WEB3_CHAIN_ID) {

            console.log(`${fnName}: chainId type: ` + typeof(chainId))
            console.log(`${fnName}: process.env.NEXT_PUBLIC_WEB3_CHAIN_ID type: ` +
                        typeof(process.env.NEXT_PUBLIC_WEB3_CHAIN_ID))

            throw new CustomError(
                        `${fnName}: chainId: ` +
                        JSON.stringify(chainId) +
                        ` not as expected: ` +
                        JSON.stringify(process.env.NEXT_PUBLIC_WEB3_CHAIN_ID))
          }
        }

        // Return
        console.log(`${fnName}: returning chainId: ${chainId}`)

        return chainId
      })
      .catch((error: any) => {
        console.error(error)
      })
  }
}
