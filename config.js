'use strict';

const merge = require('./utils/merge');

const config = {

  // 接口和前端等可视化相关的端口号
  serverPort: 8104,

  // anyproxy 的一些设置
  anyproxy: {
    // 代理的端口号，抓取开始时需手动设置
    port: 8101,
    // anyproxy 的前端可视化界面
    webInterface: {
      // 是否开启
      enable: true,
      // 访问的端口地址
      webPort: 8102
    },
    // 限制网络速度 kb/s number
    // 设置为 undefined 不限速
    throttle: undefined,
    // 是否强制解析所有 HTTPS 流量
    forceProxyHttps: true,
    // 是否开启 websocket 代理
    wsIntercept: false,
    // 控制 anyproxy 是否在命令行打印抓取记录等 log 信息
    silent: false
  },

  // mongo 数据库设置
  mongodb: {
    db: 'mongodb://127.0.0.1:27017/wechat_spider'
  },

  // redis 设置
  redis: {
    port: 6379,
    host: '127.0.0.1',

    // 存储抓取文章列表的 key 名称
    POST_LIST_KEY: 'wechat_spider:post_list',
    // 存储抓取微信公众号历史列表的 key 名称
    PROFILE_LIST_KEY: 'wechat_spider:profile_list'
  },

  // 自定义抓取规则
  rule: {
    // 文章页面相关设置
    page: {
      // 是否关闭自动跳转页面的功能
      // 跳转指文章页跳至下一个文章页，不能文章页和公众号历史页互相跳转
      disable: false,
      // 跳转时间间隔，单位秒
      jumpInterval: 2,

      // 跳转文章发布时间范围
      minTime: new Date('2018-1-1'),
      maxTime: new Date('2018-7-1'),

      // 已经抓取过的文章是否需要再次抓取
      isCrawlExist: false,
      // 如果上面设置为 true，此项可控制再次重复抓取文章的时间间隔
      // updateNumAt - publishAt < crawlExistInterval => 抓取
      // 默认 3 天，数据已趋于稳定
      crawlExistInterval: 1000 * 60 * 60 * 24 * 3,

      // 抓取公众号 biz 范围 [string]
      // 为空表示不限制范围
      targetBiz: [],

      // 是否保存微信文章内容
      // 内容占用很多空间，尤其是html形式
      isSavePostContent: true,
      // 保存内容的形式: html/text
      saveContentType: 'html',
    },

    // 公众号查看全部历史文章页面相关设置
    profile: {
      // 是否关闭自动跳转页面的功能
      // 跳转不能文章页和公众号历史页互相跳转
      disable: false,
      // 跳转时间间隔，单位秒
      jumpInterval: 5,

      // 页面会自动下拉
      // 下拉至此项设置的时间便会停止
      // 然后跳转至下一个公众号历史页面
      minTime: new Date('2018-1-1'),

      // 控制在此时间后已经抓取过的公众号本次就不用再抓取了
      maxUpdatedAt: new Date('2018-7-1'),

      // 抓取公众号 biz 范围 [string]
      // 为空表示不限制范围
      targetBiz: [],
    },

    // 功能：是否抓取评论
    isCrawlComments: true,

    // 优化项：是否替换掉所有的图片请求
    isReplaceImg: false,
    // 优化项：是否替换手机上显示的正文内容
    isReplacePostBody: false,
  },

  mp: {
    cookie: '',
    token: '',
  },

  // 添加代理基本认证
  // 如果开启此配置，则代理时需要先输入用户和密码才可正常运行
  proxyBasicAuth: {
    enable: false,
    user: 'admin',
    password: '123456',
  },

};

// docker 配置
if (process.env.DEPLOY === 'docker') {
  config.mongodb.db = 'mongodb://mongo:27017/wechat_spider';
  config.redis.host = 'redis';
}


// 加载自定义的配置
try {
  const myConfig = require('./my_config.json');
  merge(config, myConfig);
} catch(e) {
  // console.log(e);
  // Do nothing
}

module.exports = config;
