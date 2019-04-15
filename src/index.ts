import Telegraf, { ContextMessageUpdate } from 'telegraf'
// import rateLimit from 'telegraf-ratelimit'

import { TOKEN, LIMIT } from '@/config'

(async () => {

  const bot = new Telegraf(TOKEN)
  /*
  try {
    await bot.use(rateLimit(LIMIT))
  } catch (err) {
    console.log(err)
  }
  */

  bot.start((ctx: ContextMessageUpdate) => ctx.reply('Welcome!'))
  bot.help(({ reply }) => reply('Send me url of a photo from the Istock. Example: https://www.istockphoto.com/de/en/photo/overpass-at-night-gm514520416-88146253'))

  bot.hears(/^\/find (.+)/g, ({ message, reply }) => {
    const [, urlStock] = message.text.trim().split(/ +/)

    if (urlStock.indexOf('istockphoto.com') === -1) {
      return reply('Incorrect url! 😞')
    }
    console.log(urlStock)
  })

  bot.on('sticker', (ctx) => ctx.reply('👍'))

  bot.catch((err) => {
    console.log('Ooops', err)
  })

  try {
    await bot.launch()
  } catch (err) {
    console.log(err)
  }
})()

