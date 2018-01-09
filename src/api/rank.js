import jsonp from '@/common/js/jsonp'
import { commonParams, options } from './config'
import { getUid } from '@/common/js/util'

export function getTopList () {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  return jsonp(url, data, options)
}

export function getMusicList (topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

  const data = Object.assign({}, commonParams, {
    topid,
    needNewCode: 1,
    uin: 0,
    tpl: 3,
    page: 'detail',
    type: 'top',
    platform: 'h5'
  })

  return jsonp(url, data, options)
}

// 这个接口可以拿到vkey
export function getVKey (songmid) {
  var url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg';

  var data = Object.assign({}, commonParams, {
    cid: 205361747,
    format: 'json',
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    uin: 0,
    songmid: songmid,
    filename: 'C400' + songmid + '.m4a',
    guid: getUid()
  })

  return jsonp(url, data, options)
}
