var express = require('express')
var config = require('./config/index')
var axios = require('axios')

const app = express()
const api = express.Router()
app.use(express.static('./dist'))

app.get('/api/getRecommendSongMenu', function(req, res) {
  let url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg' 
  axios
    .get(url, {
      headers: {
        referer: 'https://c.y.qq.com/',
        host: 'c.y.qq.com'
      },
      params: req.query
    })
    .then((response) => {
      res.json(response.data)
    })
    .catch((err) => {
      console.log(err)
    })

})

app.get('/api/lyric', function(req, res) {
  let url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg' 
  axios
    .get(url, {
      headers: {
        referer: 'https://c.y.qq.com/',
        host: 'c.y.qq.com'
      },
      params: req.query
    })
    .then((response) => {
      let ret = response.data
      if (typeof ret === 'string') {
        let reg = /^\w+\(({[^()]+})\)$/
        let matches = ret.match(reg)
        if (matches) ret = JSON.parse(matches[1])
      }
      res.json(ret)
    })
    .catch((err) => {
      console.log(err)
    })
})

app.get('/api/getSongList', function(req, res) {
  let url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg' 
  axios
    .get(url, {
      headers: {
        referer: 'https://c.y.qq.com/',
        host: 'c.y.qq.com'
      },
      params: req.query
    })
    .then((response) => {
      let ret = response.data
      if (typeof ret === 'string') {
        let reg = /^\w+\({(.*)}\)$/
        let matches = ret.match(reg)
        if (matches) ret = JSON.parse('{' + matches[1] + '}')
      }
      res.json(ret)
    })
    .catch((err) => {
      console.log(err)
    })
})

app.use('/api', api)

var port = process.env.PORT || config.build.port
module.exports = app.listen(port, (err) => {
  if (err) {
    return console.log(err)
  }
  console.log('listen on localhost:' + port + '\n')
})
