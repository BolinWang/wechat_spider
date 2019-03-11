'use strict';

const express = require('express');
const fs = require('fs');
const util = require('util');
const path = require('path');
const merge = require('../../utils/merge');
const wrap = require('../wrap');
const config = require('../../config');
const { delCrawlLinkCache } = require('../../utils');
const ContentHandler = require('../../utils/contentHandler')

const api = express();
const writeFilePromise = util.promisify(fs.writeFile);

// get config
api.get('/', wrap(async (req, res) => {
  const { link } = req.query
  doGetHtml(link).then(html => {
    res.json({
      data: config,
      html,
      query: req.query
    })
  })
}));

// update config
api.put('/', wrap(async (req, res) => {
  const body = req.body;
  merge(config, body);
  // 本地存储
  await writeFilePromise(path.join(__dirname, '../../my_config.json'), JSON.stringify(config, null, 2));
  // 删除 redis 中缓存
  // TODO: 仅在符合更改条件的情况下删除
  await delCrawlLinkCache();
  res.json({ state: 1, message: '更新配置成功' });
}));

async function doGetHtml(link) {
  const contentHandler = new ContentHandler({ link: 'http://mp.weixin.qq.com/s?__biz=MjM5ODQzNjAwMA==&amp;mid=2651440983&amp;idx=2&amp;sn=94a8636f6b3fa037e408b08bb04082dd&amp;chksm=bd37aa988a40238ebdb9898359a989e59883e1de53ca932c94ac96826defd88c69627a26e406&amp;scene=27#wechat_redirect' });
  return await contentHandler.toHtml();
}

module.exports = api;
