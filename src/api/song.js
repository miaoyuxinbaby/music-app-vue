import { commonParams, options } from './config'
import axios from 'axios'
import jsonp from '@/common/js/jsonp'
import { getUid } from '@/common/js/util.js'

export function getLyric (mid) {
  const url = '/api/lyric'
  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    // +new Date()时间戳
    pcachetime: +new Date(),
    format: 'json'
  })

  return axios
          .get(url, {
            params: data
          })
          .then((res) => {
            // 有时需要将现有对象转为 Promise 对象，
            // 即getLyric返回的是一个promise对象
            return Promise.resolve(res.data)
          })
}

export function getVKey (songmid, filename) {
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'

  const data = Object.assign({}, commonParams, {
    cid: 205361747,
    format: 'json',
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    uin: 0,
    songmid,
    filename,
    guid: getUid()
  })

  return jsonp(url, data, Object.assign({}, options, {
    param: 'callback'
  }))
}
