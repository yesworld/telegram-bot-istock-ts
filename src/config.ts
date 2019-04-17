import * as dotenv from 'dotenv'
dotenv.config({ path: '.env' })

const IS_DEV: boolean = process.env.NODE_ENV === 'development'
const TOKEN: string = process.env.TOKEN

const PROXY_HOST: string = process.env.TELEGRAM_PROXY_HOST || null
const PROXY_PORT: number = +process.env.TELEGRAM_PROXY_PORT || null

export {
  TOKEN,
  PROXY_HOST,
  PROXY_PORT,
}

export default IS_DEV
