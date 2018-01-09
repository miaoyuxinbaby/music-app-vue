<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box @query="onQueryChange" ref="searchBox"></search-box>
    </div>
    <div class="shortcut-wrapper">
      <div class="shortcut">
        <div class="hot-key" v-show="!query">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li
              v-for="(item, index) in hotkey"
              :key="index"
              @click="addQuery(item.k)"
              class="item">
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="search-result">
      <suggest :query="query"></suggest>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from '@/base/search-box/search-box'
import Suggest from '@/components/suggest/suggest'
import { getHotKey } from '@/api/search'
import { CODE } from '@/api/config'

export default {
  components: {
    SearchBox,
    Suggest
  },
  created () {
    this._getHotKey()
  },
  data () {
    return {
      hotkey: [],
      query: ''
    }
  },
  methods: {
    addQuery (val) {
      this.$refs.searchBox.setQuery(val)
    },
    onQueryChange (query) {
      this.query = query
    },
    _getHotKey () {
      getHotKey()
        .then(res => {
          if (res.code === CODE) this.hotkey = res.data.hotkey.slice(0, 10)
        })
    }
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