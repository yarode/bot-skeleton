const dotenv = require('dotenv')
const { getTransactionsByAccount } = require('./utils')

dotenv.config()

const Web3 = require("web3")
const provider = new Web3.providers.HttpProvider(process.env.WEB3_URL)
const web3 = new Web3(provider)

const DECIMALS = 9
const AMOUNT_STEPS = 7 * 24 * 60 * 60 * 1000

const minABI = [
  // issuedSupply
  {
    "inputs":[],
    "name":"issuedSupply",
    "outputs":
    [{
      "internalType":"uint256",
      "name":"",
      "type":"uint256"
    }],
    "stateMutability":"view",
    "type":"function"
  },
  // outstandingSupply
  {
    "inputs":[],
    "name":"outstandingSupply",
    "outputs":
      [{
        "internalType":"uint256",
        "name":"",
        "type":"uint256"
      }],
    "stateMutability":"view",
    "type":"function"
  }]

const bmag = new web3.eth.contract(minABI, process.env.TOKEN_ID)

exports.getStaked() = async () => {
  stakedAmount = await bmag.methods.outStandingSupply().call()
  stakedAmount /= 10 ** DECIMALS
  return stakedAmount.toFixed(2)
}

exports.getVested() = async () => {
  currentTime = Date.now()
  current_steps = currentTime - process.env.START_TIME
  supply = await bmag.methods.issuedSupply().call()
  supply /= 10 ** DECIMALS
  step_value = supply/AMOUNT_STEPS
  vested = supply - (step_value * current_steps)
  return vested.toFixed(2)
}

exports.getClaimed() = async () => {
  supply = await bmag.methods.issuedSupply().call()
  staked = await bmag.methods.outStandingSupply().call()
  claimed = supply - staked
  claimed /= 10 ** DECIMALS
  return claimed.toFixed(2)
}
