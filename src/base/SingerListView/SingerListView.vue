<template>
  <Scroll :data="data"
          :listenScroll="listenScroll"
          :probeType="probeType"
          @scroll="scroll"
          ref="ListView"
          class="SingerListView" >
    <ul>
      <li v-for="(items, index) in data" 
          :key="index"
          ref="longList"
          class="list-group">
        <h2 class="list-group-title">{{items.title}}</h2>
        <ul>
          <li v-for="(item, index) in items.items"
              :key="index"
              @click="selectItem(item)"
              class="list-group-item">
            <img v-lazy="item.imgUrl">
            <span>{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-short">
      <ul>
        <li v-for="(item,index) in shortList"
            @touchstart="onShortListTouchStart"
            @touchmove.stop.prevent="onShortListTouchmove"
            
            :class="{'current': currentIndex===index}"
            :key="index"
            :data-index="index">{{item}}
        </li>
      </ul>
    </div>
    <div ref="fixed" v-show="fixedTitle" class="list-fixed">
      <div>{{fixedTitle}}</div>
    </div>
  </Scroll>
</template>

<script>
import Scroll from '@/base/scroll/scroll'
import { customDataAPI } from '@/common/js/dom'

const ANCHOR_HEIGHT = 20
export default {
  created () {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
  },
  data () {
    return {
      scrollY: -1,
      currentIndex: 0
    }
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  components: {
    Scroll
  },
  computed: {
    shortList () {
      return this.data.map((item) => {
        return item.title.substr(0, 1)
      })
    },
    fixedTitle () {
      if (this.scrollY > 0) return ''
      return this.data[this.currentIndex]
              ? this.data[this.currentIndex].title
              : ''
    }
  },
  methods: {
    refresh () {
      this.$refs.ListView.refresh()
    },
    selectItem (item) {
      this.$emit('select', item)
    },
    onShortListTouchStart (e) {
      let anchorIndex = customDataAPI(e.target, 'index')
      this.touch.y1 = e.touches[0].pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortListTouchmove (e) {
      this.touch.y2 = e.touches[0].pageY
      let offset = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      let anchorIndex = parseInt(this.touch.anchorIndex) + offset
      this._scrollTo(anchorIndex)
    },
    scroll (position) {
      this.scrollY = position.y
    },
    _scrollTo (index) {
      if (index < 0) index = 0
      else if (index > this.listHeight.length - 2) index = this.listHeight.length - 2
      this.scrollY = -this.listHeight[index]
      this.$refs.ListView.scrollToElement(this.$refs.longList[index], 0)
    },
    _calculateHeight () {
      this.listHeight = []
      const list = this.$refs.longList
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    data () {
      // dom渲染是有一定延迟的
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY (newY) {
      const listHeight = this.listHeight
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          console.log(this.currentIndex)
          return
        }
      }
      this.currentIndex = listHeight.length - 2
      console.log(this.currentIndex)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable'

.SingerListView 
  position relative
  width 100%
  height 100%
  overflow hidden
  background $color-background

  .list-group 
    padding-bottom 30px

  .list-group-title 
    height 30px
    line-height 30px
    padding-left 20px
    color $color-text-l
    background $color-highlight-background

  .list-group-item 
    display flex
    align-items center
    padding 20px 0 0 30px

    img 
      width 50px
      height 50px
      border-radius 50%
    span 
      margin-left 20px

  .list-short 
    position absolute
    right 0
    top 50%
    transform translateY(-50%)
    width 20px
    padding 20px 3px
    border-radius 10px
    text-align center
    background $color-background-d
    font-family Helvetica

    li 
      padding 3px
      line-height 1
      color $color-text-l
      font-size $font-size-medium

      &.current 
        color $color-text-y

  .list-fixed 
    position absolute
    top 0
    left 0
    width 100%
    div
      height 30px
      line-height 30px
      padding-left 20px
      font-size $font-size-medium
      color: $color-text-l
      background $color-highlight-background
</style>
