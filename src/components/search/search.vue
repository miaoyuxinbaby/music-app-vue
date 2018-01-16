<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box @query="onQueryChange" ref="searchBox"></search-box>
    </div>
    <div class="shortcut-wrapper" ref="shortcutWrapper">
      <scroll class="shortcut" :data="shortCut" ref="shorcut">
        <div>
          <div class="hot-key" v-show="!query">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li
                v-for="(item, index) in hotkey"
                :key="index"
                @click="addQuery(item.k)"
                class="item needsclick">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length && !query">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="deleteAll">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list
              :searches="searchHistory" 
              @select="addQuery"
              @deleteOne="deleteOne"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest :query="query" @listScroll="blurInput" @select="saveSearch" ref="suggest"></suggest>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from '@/base/search-box/search-box'
import Suggest from '@/components/suggest/suggest'
import { getHotKey } from '@/api/search'
import { CODE } from '@/api/config'
import { mapActions } from 'vuex'
import SearchList from '@/base/search-list/search-list'
import Scroll from '@/base/scroll/scroll'
import { playListMixin, searchMixin } from '@/common/js/mixin'

export default {
  mixins: [playListMixin, searchMixin],
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Scroll
  },
  created () {
    this._getHotKey()
  },
  computed: {
    shortCut () {
      return this.hotkey.concat(this.saveSearchHistory)
    }
  },
  watch: {
    query (newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shorcut.refresh()
        }, 20)
      }
    }
  },
  data () {
    return {
      hotkey: []
    }
  },
  methods: {
    handlePlaylist (playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shorcut.refresh()
      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()
    },
    deleteOne (item) {
      this.deletaSearchHistory(item)
    },
    deleteAll () {
      this.clearSearchHistory()
    },
    _getHotKey () {
      getHotKey()
        .then(res => {
          if (res.code === CODE) this.hotkey = res.data.hotkey.slice(0, 10)
        })
    },
    ...mapActions([
      'clearSearchHistory'
    ])
  }
}
</script>

<style lang="stylus" scoped>
  @import "~@/common/stylus/variable"
  @import "~@/common/stylus/mixin"

  .search
    .search-box-wrapper
      margin 20px
    .shortcut-wrapper
      position fixed
      top 178px
      bottom 0
      width 100%
      .shortcut
        height 100%
        overflow hidden
        .hot-key
          margin 0 20px 20px 20px
          .title
            margin-bottom 20px
            font-size $font-size-medium
            color $color-text-l
          .item
            display inline-block
            padding 5px 10px
            margin 0 20px 10px 0
            border-radius 6px
            background $color-highlight-background
            font-size $font-size-medium
            color $color-text-d
        .search-history
          position relative
          margin 0 20px
          .title
            display flex
            align-items center
            height 40px
            font-size $font-size-medium
            color $color-text-l
            .text
              flex 1
            .clear
              extend-click()
              .icon-clear
                font-size $font-size-medium
                color $color-text-d
    .search-result
      position fixed
      width 100%
      top 178px
      bottom 0
      // z-index -1
</style>