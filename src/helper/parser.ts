import * as cheerio from 'cheerio'

interface IStockData {
  id: string,
  photographer: string,
}

interface GoogleLink {
  img: string,
  googleLink: string,
}

interface ResultData extends IStockData, GoogleLink {}

interface CheerioOptionsInterface {
  xmlMode?: boolean
  decodeEntities?: boolean
  lowerCaseTags?: boolean
  lowerCaseAttributeNames?: boolean
  recognizeCDATA?: boolean
  recognizeSelfClosing?: boolean
  normalizeWhitespace?: boolean
  ignoreWhitespace?: boolean
}

/**
 * Document References
 * @class Parser class is using the cheerio
 *
 * Cheerio https://github.com/cheeriojs/cheerio
 * HTMLParser2 https://github.com/fb55/htmlparser2/wiki/Parser-options
 * DomHandler https://github.com/fb55/DomHandler
 */
export default class ParserHtml {

  private option: CheerioOptionsInterface

  constructor() {
    this.option = {decodeEntities: false}
  }

  /**
   * Get data information about a photo.
   * @param body
   */
  public getDataFromStock(body: string): IStockData|null {
    const $ = cheerio.load(body, this.option)

    const photographer = $('.photographer span').text()
    const id = $('div.asset-id span').last().text()

    if (!photographer || !id) {
      return null
    }

    return {
      id,
      photographer,
    }
  }

  /**
   * Find a link to a photo in the IStock search result
   * @param body
   */
  public getImageFromSearchIstock(body: string): string|null {
    const $ = cheerio.load(body, this.option)
    const imageUrl = $('a.search-result-asset-link img').attr('src')
    return imageUrl ? imageUrl : null
  }

  /**
   * Find a link to a photo in the Google search result
   * @param body
   */
  public getImageFromGoogle(body: string): GoogleLink|null {
    const $ = cheerio.load(body, this.option)
    const $a = $('#center_col #res .card-section > div a')
    if (!$a.length) {
      return null
    }

    const url = $a.find('img').attr('src')
    if (!url) {
      return null
    }

    return {
      img: 'https:' + url.replace(/=s[0-9]+/, '=s320'),
      googleLink: 'https://www.google.com' + $a.attr('href'),
    }
  }
}

export {
  IStockData,
  GoogleLink,
  ResultData,
}
