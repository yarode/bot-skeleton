const { numberWithCommas } = require('./utils')

function statsEmbed(staked, vested, unvested, claimed, ratio) {
  return {
    embed: {
      title: 'bMAG statistics 🧲',
      description:
        'Statistics on current bMAG vesting schedule, bMAG staked & more',
      color: 15868435,
      fields: [
        {
          name: 'Staked bMAG',
          value: `${numberWithCommas(staked)}`,
        },
        {
          name: 'Vested bMAG',
          value: `${numberWithCommas(vested)}`
        },
        {
          name: 'Unvested bMAG',
          value: `${numberWithCommas(unvested)}`,
        },
        {
          name: 'Claimed bMAG',
          value: `${numberWithCommas(claimed)}`,
        },
        {
          name: 'Ratio of claimed bMAG against unvested bMAG',
          value: `${numberWithCommas(ratio)}`,
        },
      ],
      timestamp: new Date(),
      footer: {
        text: 'https://twitter.com/magnet_dao',
      }
    }
  }
}

module.exports = {
  statsEmbed
}
