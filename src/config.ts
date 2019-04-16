import * as dotenv from 'dotenv'
dotenv.config({ path: '.env' })

const IS_DEV: boolean = process.env.NODE_ENV === 'development'
const TOKEN: string = process.env.TOKEN

export {
  TOKEN,
}

export default IS_DEV
