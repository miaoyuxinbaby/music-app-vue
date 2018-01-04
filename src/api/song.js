import { commonParams } from './config'
import axios from 'axios'

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
