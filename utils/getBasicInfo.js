const rp = require('request-promise')

module.exports = class GetBasicInfo {

  constructor(options = {}) {
    const { link } = options
    if (!link) throw new Error('请传入link')
    this.link = link
  }

  async getBody() {
    return await rp(this.link)
  }
}
