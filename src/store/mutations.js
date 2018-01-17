import * as types from './mutation-types'

// 规则。== redux 里的 reducer
const mutations = {
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  },
  [types.SET_PLAYING] (state, flag) {
    state.playing = flag
  },
  [types.SET_FULL_SCREEN] (state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST] (state, list) {
    state.playList = list
  },
  [types.SET_SEQUENCELIST] (state, list) {
    state.sequenceList = list
  },
  [types.SET_MODE] (state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENTINDEX] (state, index) {
    state.currentIndex = index
  },
  [types.SET_DISC] (state, obj) {
    state.disc = obj
  },
  [types.SET_TOPLIST] (state, obj) {
    state.topList = obj
  },
  [types.SET_SEARCHHISTORY] (state, arr) {
    state.searchHistory = arr
  },
  [types.SET_PLAYHISTORY] (state, history) {
    state.playHistory = history
  },
  [types.SET_FAVORITELIST] (state, list) {
    state.favoriteList = list
  }
}

export default mutations
