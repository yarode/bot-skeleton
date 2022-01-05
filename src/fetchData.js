const dotenv = require('dotenv')
const { getTransactionsByAccount } = require('./utils')

dotenv.config()

const Web3 = require("web3")
const provider = new Web3.providers.HttpProvider(process.env.WEB3_URL)
const web3 = new Web3(provider)

exports.getSomeData = async () => {
  // do some web3 thingy
  data = await web3.eth.getBlockNumber()
  return data
}
