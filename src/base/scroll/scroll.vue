<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BetterScroll from 'better-scroll'
export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    pullup: {
      type: Boolean,
      default: false
    },
    beforeScroll: {
      type: Boolean,
      default: false
    },
    refreshDelay: {
      type: Number,
      default: 20
    }
  },
  mounted () {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    _initScroll () {
      if (!this.$refs.wrapper) return
      this.scroll = new BetterScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })
      if (this.listenScroll) {
        let _self = this
        this.scroll.on('scroll', (position) => {
          _self.$emit('scroll', position)
        })
      }
      if (this.pullup) {
        // 监听onscrollend事件。当滚动结束时触发
        this.scroll.on('scrollEnd', () => {
          // 手指释放时滚动坐标小于最大坐标+偏移50
          if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
            this.$emit('scrollToEnd')
          }
        })
      }
      // 滚动前触发事件，这里用来让Input失去焦点
      if (this.beforeScroll) {
        this.scroll.on('beforeScroll', () => {
          this.$emit('beforeScroll')
        })
      }
    },
    enable () {
      this.scroll && this.scroll.enable()
    },
    disable () {
      this.scroll && this.scroll.disable()
    },
    refresh () {
      this.scroll && this.scroll.refresh()
    },
    scrollTo () {
      this.scrollTo && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement () {
      this.scrollToElement && this.scroll.scrollToElement.apply(this.scroll, arguments)
      this.refresh()
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this.refresh()
      }, this.refreshDelay)
    }
  }
}
</script>

<style lang="stylus" scoped>

       
</style>
