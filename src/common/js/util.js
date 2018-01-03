// 打乱数组
export function shuffle (arr) {
  const _arr = arr.slice()
  const len = _arr.length
  for (let i = 0; i < len; i++) {
    const j = getRandomInt(0, i)
    const tempArr = [_arr[i], _arr[j]]
    _arr[i] = tempArr[1]
    _arr[j] = tempArr[0]
  }
  return _arr
}
// 获取min和max之间的随机整数
function getRandomInt (min, max) {
  return (Math.random() * (max - min + 1)) | 0
}
