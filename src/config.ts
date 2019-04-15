import { ContextMessageUpdate } from 'telegraf'

import * as dotenv from 'dotenv'
dotenv.config({ path: '.env' })

const IS_DEV: boolean = process.env.NODE_ENV === 'development'
const TOKEN: string = process.env.TOKEN

/**
 * Set limit to 1 message per 2 seconds
 * @url https://github.com/telegraf/telegraf-ratelimit
 */
const LIMIT = {
  window: 2000,
  limit: 1,
  onLimitExceeded: (ctx: ContextMessageUpdate, next: any) => ctx.reply('Rate limit exceeded')
}

export {
  TOKEN,
  LIMIT,
}

export default IS_DEV
