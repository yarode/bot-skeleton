const { Client } = require('discord.js')
const dotenv = require('dotenv')
const { getStaked, getVested, getClaimed } = require('./fetchData')

const { numberWithCommas } = require('./utils')

dotenv.config()

const client = new Client()

let next = 0

// eslint-disable-next-line
client.on('ready', () => {
  console.log(`Bot successfully started as ${client.user.tag}`)
})

async function() updateBot(nickname, status) {
  client.guilds.cache.forEach(async (guild) => {
    const botMember = guild.me
    await botMember.setNickname(numberWithCommas(nickname))
  })

  client.user.setActivity(status[0], status[1])

  console.log(`Updated nickname to - ${nickname}`)
  console.log(`Updated status to - Watching: ${status[0]}`)
}

// Updates treasury balance on bot's status every X amount of time
client.setInterval(async () => {
  if(!next) {
    // display staked bMag
    staked = await getStaked()
    status = ['Staked bMAG', { type: 'WATCHING' }]
    await updateBot(staked, staked)

    next = 1
  } if(next == 1) {
    // display vested bMag
    vested = await getVested()
    status = ['Vested bMAG', { type: 'WATCHING' }]
    await updateBot(vested, status)

    next = 2
  } else {
    // display claimed bMag
    claimed = await getClaimed()
    status = ['Claimed bMAG', { type: 'WATCHING' }]
    await updateBot(claimed, status)
    
    next = 0
  }

}, parseInt(process.env.INTERVAL) * 60 * 1000)

client.login(process.env.DISCORD_API_TOKEN)
