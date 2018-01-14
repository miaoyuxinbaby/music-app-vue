<template>
  <scroll :data="result"
          :pullup="pullup"
          :beforeScroll="beforeScroll"
          ref="suggest"
          @scrollToEnd="searchMore"
          @beforeScroll="listScroll"
          class="suggest">
    <ul class="suggest-list">
      <li 
        v-for="(item, index) in result"
        :key="index"
        @click="selectItem(item)"
        class="suggest-item">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasmore"></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasmore && result.length === 0">
      <no-result title="没有找到歌曲哦"></no-result>
    </div>
  </scroll>
</template>

<script>
import { search } from '@/api/search'
import { CODE } from '@/api/config'
import { createSong } from '@/common/js/song'
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
import Singer from '@/common/js/singer'
import NoResult from '@/base/no-result/no-result'
import { mapMutations, mapActions } from 'vuex'

const TYPE_SINGER = 'singer'
const PERPAGE = 20

export default {
  components: {
    Scroll,
    Loading,
    NoResult
  },
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      page: 1,
      result: [],
      pullup: true,
      hasmore: true,
      beforeScroll: true
    }
  },
  watch: {
    query () {
      this._search()
    }
  },
  methods: {
    refresh () {
      this.$refs.suggest.refresh()
    },
    listScroll () {
      this.$emit('listScroll')
    },
    selectItem (item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }
      this.$emit('select')
    },
    searchMore () {
      if (!this.hasmore) return
      this.page++
      search(this.query, this.page, this.showSinger, PERPAGE)
        .then(res => {
          if (res.code === CODE) this.result = this.result.concat(this._genResult(res.data))
          this._checkMore(res.data)
        })
    },
    getIconCls (item) {
      return item.type === TYPE_SINGER ? 'icon-mine' : 'icon-music'
    },
    getDisplayName (item) {
      return item.type === TYPE_SINGER ? item.singername : `${item.name}-${item.singer}`
    },
    _search () {
      // 修改关键词时 重置配置项
      this.page = 1
      this.hasmore = true
      this.$refs.suggest.scrollTo(0, 0)
      search(this.query, this.page, this.showSinger, PERPAGE)
        .then(res => {
          if (res.code === CODE) {
            this.result = this._genResult(res.data)
            this._checkMore(res.data)
          }
        })
    },
    _checkMore (data) {
      const song = data.song
      const isNoMore = !song.list.length || (song.curnum + song.curpage * PERPAGE) > song.totalnum
      if (isNoMore) this.hasmore = false
    },
    _genResult (data) {
      let ret = []
      // 2个扩展运算符组合成新对象。约等于 Object.assign()
      if (data.zhida && data.zhida.singerid) ret.push({...data.zhida, ...{type: TYPE_SINGER}})
      if (data.song) ret = ret.concat(this._normalizeSongs(data.song.list))
      return ret
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach(item => {
        if (item.songid && item.albumid) ret.push(createSong(item))
      })
      return ret
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  }
}
</script>

<style lang="stylus" scoped>
  @import "~@/common/stylus/variable"
  @import "~@/common/stylus/mixin"

  .suggest
    height 100%
    overflow hidden
    .suggest-list
      padding 0 30px
      .suggest-item
        display flex
        align-items center
        padding-bottom 20px
      .icon
        flex 0 0 30px
        width 30px
        [class^="icon-"]
          font-size 14px
          color $color-text-d
      .name
        flex 1
        font-size $font-size-medium
        color $color-text-d
        overflow hidden
        .text
          no-wrap()
    .no-result-wrapper
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
</style>
