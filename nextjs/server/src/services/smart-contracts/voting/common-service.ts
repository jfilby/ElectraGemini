import Web3 from 'web3'

export class CommonVotingSmartContractService {

  // Consts
  clName = 'CommonVotingSmartContractService'

  contractsPath = `${process.env.NEXT_PUBLIC_NEXTJS_SRC_PATH}/server/src/services/smart-contracts/voting`
  contractSourceFilename = `${this.contractsPath}/voting.sol`
  abiFilename = `${this.contractsPath}/voting.abi.json`
  bytecodeFilename = `${this.contractsPath}/voting.bin`
  deployedAddressFilename = `${this.contractsPath}/voting.deployed-address.txt`

  // Code
  connect() {

    // Connect to network
    return new Web3(process.env.NEXT_PUBLIC_WEB3_NETWORK_URL)
  }
}
