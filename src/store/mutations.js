import * as types from './mutation-types'

// 规则。== redux 里的 reducer
const mutations = {
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  }
}

export default mutations
