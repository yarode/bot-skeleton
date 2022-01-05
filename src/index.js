const Discord = require('discord.js')
const dotenv = require('dotenv')
const { getStaked, getVested, getClaimed } = require('./fetchData')
const { RequestHandlerError } = require('./error-utils')
const detectHandler = require('./parser/detectHandler')

const { numberWithCommas } = require('./utils')

dotenv.config()

const client = new Discord.Client({
  intents: [
    "GUILDS",
    "GUILD_MESSAGES",
    "DIRECT_MESSAGES"
  ]})

let next = 0

client.on('ready', () => {
  console.log(`Bot successfully started as ${client.user.tag}`)
})

async function updateBot(nickname, status) {
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
    await updateBot(staked, status)

    next = 1
  } else if(next == 1) {
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

client.on('message', (message) => {
  if (message.author.bot) return
  try {
    const handler = detectHandler(message.content)
    if (handler) {
      // Checks if channel is #bot-commands or message is NOT from guild
      if (
        message.channel.id === process.env.CHANNEL_ID ||
        message.guild === null
      ) {
        handler(message)
        log(
          `Served command ${message.content} successfully for ${message.author.username}.`,
        )
      } else {
        message.delete({ timeout: 500 })
        return
      }
    }
  } catch (err) {
    if (err instanceof RequestHandlerError) {
      log(err)
      message.reply(
        'Could not find the requested command. Please use !trident help for more info.',
      )
    }
  }
})

client.login(process.env.DISCORD_API_TOKEN)
