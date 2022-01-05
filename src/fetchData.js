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

const bmag = new web3.eth.Contract(minABI, process.env.TOKEN_ID)

async function calcVested(supply) {
  currentTime = Date.now()
  current_steps = currentTime - parseInt(process.env.START_TIME)
  step_value = supply/AMOUNT_STEPS
  vested = supply - (step_value * current_steps)
  return vested
}

exports.getData = async () => {
  let data = {
    outstanding: 0,
    issued: 0,
    claimed: 0,
    vested: 0
  }

  outstanding = await bmag.methods.outstandingSupply().call()
  data.outstanding = outstanding / 10 ** DECIMALS

  issued = await bmag.methods.issuedSupply().call()
  data.issued = issued / 10 ** DECIMALS

  data.claimed = (issued - outstanding) / 10 ** DECIMALS

  vested = await calcVested(issued)
  data.vested = vested / 10 ** DECIMALS
  return data
}

exports.getStaked = async () => {
  staked = await bmag.methods.outstandingSupply().call()
  staked /= 10 ** DECIMALS
  return staked.toFixed(2)
}

exports.getVested = async () => {
  supply = await bmag.methods.issuedSupply().call()
  supply /= 10 ** DECIMALS

  vested = await calcVested(supply)
  return vested.toFixed(2)
}

exports.getClaimed = async () => {
  supply = await bmag.methods.issuedSupply().call()
  supply /= 10 ** DECIMALS

  outstanding = await bmag.methods.outstandingSupply().call()
  outstanding /= 10 ** DECIMALS

  claimed = supply - outstanding
  return claimed.toFixed(2)
}
