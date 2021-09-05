const Mock = require("mockjs");

// 随机生成对象
var data = Mock.mock({
  id: '@id()',
  username: '@cname()',
  date: '@date(yyyy.MM.dd)',
  description: '@paragraph()',
  email: '@email()',
  'age|0-60': 0
})

module.exports = function (app) {
  app.username('/login', (req, res) => {
    res.json(data)
  })
}