const { Client } = require('discord.js')
const dotenv = require('dotenv')
const { getSomeData } = require('./fetchData')

const { numberWithCommas } = require('./utils')

dotenv.config()

const client = new Client()

// eslint-disable-next-line
client.on('ready', () => {
  console.log(`Bot successfully started as ${client.user.tag}`)
  client.user.setActivity(
    `current block number`,
    { type: 'WATCHING' },
  )
})

// Updates treasury balance on bot's status every X amount of time
client.setInterval(async () => {

  const data = await getSomeData()

  client.guilds.cache.forEach(async (guild) => {
    const botMember = guild.me
    await botMember.setNickname(`$${data}`)
  })

  console.log(`Updated to - $${data}`)
}, parseInt(process.env.INTERVAL) * 60 * 1000)

client.login(process.env.DISCORD_API_TOKEN)
