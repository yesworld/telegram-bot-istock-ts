import * as needle from 'needle'
import * as tress from 'tress'

import ParserHtml, { ResultData } from '@/helper/parser'

export default class Fetch {

  private googleSearchURL = 'https://www.google.com/searchbyimage?site=search&sa=X&image_url='
  private istockSearchURL = 'https://www.istockphoto.com/ru/search/2/image?phrase='

  private parserHtml: ParserHtml

  constructor() {
    needle.defaults({
      user_agent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36', // tslint:disable-line
      compressed: true, // sets 'Accept-Encoding' to 'gzip,deflate'
      follow_max: 5, // follow up to five redirects
      rejectUnauthorized: false,
      agent: false,
    })

    this.parserHtml = new ParserHtml()
  }

  public async parse(urlIstock: string, callBack: any): Promise<any> {
    const jobData = {url: urlIstock}

    const qTress = tress(async (job: tress.TressJobData, done: tress.TressWorkerDoneCallback) => {
      const url: string = job.url as string
      let res: needle.NeedleResponse

      // Try to open IStock
      try {
        console.info(' ==> Get page URL = ', url)
        res = await needle('get', url)
      } catch (err) {
        console.log(err)
        done(Error('Page not found'))
      }

      const param = this.parserHtml.getDataFromStock(res.body)
      if (param === null) {
        done(Error('Params not found'))
      }

      // Find a photo using the IStock search
      const urlStockSearch = this.istockSearchURL + param.photographer + '%20' + param.id
      try {
        res = await needle('get', urlStockSearch)
      } catch (err) {
        console.log(err)
        done(Error('Page not found'))
      }

      const imageUrl = this.parserHtml.getImageFromSearchIstock(res.body)
      if (imageUrl === null) {
        done(Error('Url for image not founded.'))
      }

      // Find a photo using the Google
      const googleRequestUrl = this.googleSearchURL + imageUrl.replace(/&/g, '%26')
      try {
        console.info(' ==> Get google URL = ', googleRequestUrl)
        res = await needle('get', googleRequestUrl)
      } catch (err) {
        console.log(err)
        done(Error('Page not found'))
      }

      const image = this.parserHtml.getImageFromGoogle(res.body)
      if (image === null) {
        done(Error('Image not found.'))
      }

      const result: ResultData = Object.assign({}, param, image)
      done(null, result)
    })

    qTress.push(jobData)

    qTress.success = function(data: ResultData): void {
      console.info(' <== Job find photo = ', this.url, ' successfully finished. Google URL = ', data, '\n')
      callBack(data)
    }

    qTress.error = function(e: Error): void {
      const url: string = this.url as string

      callBack(null, e.message, url)
      console.error(' === ERRROR === ' + '\n', {
        job: url,
        message: e.message,
        stack: e.stack,
      })
    }
  }
}
