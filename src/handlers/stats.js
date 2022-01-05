const { statsEmbed } = require('../embed')
const { getData } = require('../fetchData')

module.exports = async function stats(message) {
  data = await getData()
  console.log(data)
  outstanding = data.outstanding
  issued = data.issued
  claimed = data.claimed
  vested = data.vested
  unvested = issued - vested
  console.log(unvested)
  ratio = claimed/unvested
  const newEmbed = statsEmbed(outstanding.toFixed(2), vested.toFixed(2), unvested.toFixed(2), claimed.toFixed(2), ratio.toFixed(2))
  message.channel.send(newEmbed)
}
