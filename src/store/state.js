import { playMode } from '@/common/js/config'
import { loadSearch } from '@/common/js/cache'

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [], // 播放列表
  sequenceList: [], // 原始列表
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {},
  topList: {},
  searchHistory: loadSearch()
}

export default state
