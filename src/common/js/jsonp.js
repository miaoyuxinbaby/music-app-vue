import originJSONP from 'jsonp'
// jsonp这个库不支持传对象，只能拼接url。这里把query变成对象传入

export default function jsonp (url, data, option) {
  url += (url.indexOf('?') === -1 ? '?' : '&') + param(data)
  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

function param (data) {
  let url = ''
  for (let k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += `&${k}=${encodeURIComponent(value)}`
  }
  return url ? url.substring(1) : ''
}
