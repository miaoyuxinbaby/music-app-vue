import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

// 参数：数组，值，比较函数，数组最大长度
function insertArray (arr, val, compare, maxLenght) {
  // arr中是否存在val
  const index = arr.findIndex(compare)
  if (index === 0) return
  if (index > 0) arr.splice(index, 1)
  arr.unshift(val)
  if (maxLenght && arr.length > maxLenght) arr.pop()
}

export function saveSearch (query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function loadSearch () {
  return storage.get(SEARCH_KEY, [])
}
