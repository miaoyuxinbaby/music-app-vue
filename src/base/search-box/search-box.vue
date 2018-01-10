<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="query" class="box" v-model="query" :placeholder="placeholder">
    <i v-show="query" @click="clearInput" class="icon-dismiss"></i>
  </div>
</template>

<script>
  import { debounce } from '@/common/js/util'
  export default {
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    data () {
      return {
        query: ''
      }
    },
    created () {
      this.$watch('query', debounce((newQuery) => {
        this.$emit('query', newQuery)
      }, 200))
    },
    methods: {
      clearInput () {
        this.query = ''
      },
      setQuery (val) {
        this.query = val
      },
      blur () {
        this.$refs.query.blur()
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~@/common/stylus/variable"

  .search-box
    display flex
    align-items center
    box-sizing border-box
    width 100%
    padding 0 6px
    height 40px
    background $color-highlight-background
    border-radius 6px
    .icon-search
      font-size 24px
      color $color-background
    .box
      flex 1
      margin 0 5px
      line-height 18px
      background $color-highlight-background
      -webkit-tap-highlight-color rgba(255, 255, 255, 0)
      -webkit-user-select none
      -moz-user-focus none
      -moz-user-select none
      -webkit-appearancenone
      outline none
      border none
      color $color-text
      font-size $font-size-medium
      &placeholder
        color $color-text-d
    .icon-dismiss
      font-size 16px
      color $color-background
</style>
