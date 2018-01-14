<template>
  <div class="player" v-show="playList.length > 0">
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img width="100%" height="100%" :src="currentSong.image">
      </div>
      <div class="top">
        <div class="back" @click="back">
          <i class="icon-back"></i>
        </div>
        <h1 class="title" v-html="currentSong.name"></h1>
        <h2 class="subtitle" v-html="currentSong.singer"></h2>
      </div>
      <div 
        @touchstart="middleTouchStart"
        @touchmove="middleTouchMove"
        @touchend="middleTouchEnd"
        class="middle">
        <div class="middle-l" ref="middleL">
          <div class="cd-wrapper">
            <div class="cd" :class="cdCls">
              <img class="image" :src="currentSong.image">
            </div>
          </div>
          <div class="playing-lyric-wrapper">
            <div class="playing-lyric">{{playingLyric}}</div>
          </div>
        </div>
        <scroll
          ref="lyricList"
          :data="currentLyric && currentLyric.lines"
          class="middle-r" >
          <div class="lyric-wrapper">
            <div v-if="currentLyric">
              <p
                v-for="(line, index) in currentLyric.lines"
                :key="index"
                :class="{'current': currentLineNum === index}"
                ref="lyricLine" 
                class="text">
                {{line.txt}}
              </p>
            </div>
          </div>
        </scroll>
      </div>
      <div class="bottom">
        <div class="dot-wrapper">
          <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
          <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
        </div>
        <div class="progress-wrapper">
          <span class="time time-l">{{_formatTime(currentTime)}}</span>
          <div class="progress-bar-wrapper">
            <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
          </div>
          <span class="time time-l">{{_formatTime(currentSong.duration)}}</span>
        </div>
        <div class="operators">
          <div class="icon i-left" @click="changeMode">
            <i :class="iconMode"></i>
          </div>
          <div class="icon i-left" :class="disableClass">
            <i @click="prev" class="icon-prev"></i>
          </div>
          <div class="icon i-center" :class="disableClass">
            <i @click="togglePlaying" :class="playIcon"></i>
          </div>
          <div class="icon i-right" :class="disableClass">
            <i @click="next" class="icon-next"></i>
          </div>
          <div class="icon i-right">
            <i class="icon-not-favorite"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="mini-player" v-show="!fullScreen" @click="open">
      <div class="icon" :class="cdCls">
        <img width="40" height="40" :src="currentSong.image">
      </div>
      <div class="text">
        <h2 class="name" v-html="currentSong.name"></h2>
        <p class="desc" v-html="currentSong.singer"></p>
      </div>
      <div class="control" @click.stop="togglePlaying">
        <progress-circle :radius="32" :percent="percent">
          <i :class="playIconMini" class="icon-mini"></i>
        </progress-circle>
      </div>
      <div class="control" @click.stop="showPlaylist">
        <i class="icon-playlist"></i>
      </div>
    </div>
    <play-list-dom ref="playListDom"></play-list-dom>
    <audio
      :src="currentSong.url"
      ref="audio"
      @canplay="ready"
      @error="error"
      @ended="end"
      @timeupdate="updateTime">
    </audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { playMode } from '@/common/js/config'
import { shuffle } from '@/common/js/util'
import Lyric from 'lyric-parser'
import ProgressBar from '@/base/progress-bar/progress-bar'
import ProgressCircle from '@/base/progress-circle/progress-circle'
import Scroll from '@/base/scroll/scroll'
import PlayListDom from '@/components/playlist/playlist'
export default {
  data () {
    return {
      songReady: false,
      currentTime: 0,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'cd',
      playingLyric: ''
    }
  },
  computed: {
    ...mapGetters([
      'fullScreen',
      'playList',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList'
    ]),
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    playIconMini () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    disableClass () {
      return this.songReady ? '' : 'disable'
    },
    percent () {
      return this.currentTime / this.currentSong.duration
    },
    cdCls () {
      return this.playing ? 'play' : 'play pause'
    },
    iconMode () {
      return this.mode === playMode.sequence
                            ? 'icon-sequence'
                            : this.mode === playMode.loop
                              ? 'icon-loop'
                              : 'icon-random'
    }
  },
  created () {
    this.touch = {}
  },
  watch: {
    currentSong (newSong, oldSong) {
      if (newSong.id === oldSong.id) return
      if (this.currentLyric) this.currentLyric.stop()
      this.$nextTick(() => {
        this.$refs.audio.play()
        this._getLyric()
      })
    }
  },
  methods: {
    showPlaylist () {
      this.$refs.playListDom.show()
    },
    middleTouchStart (e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.startY = e.touches[0].pageY
    },
    middleTouchMove (e) {
      if (!this.touch.initiated) return
      const deltaX = e.touches[0].pageX - this.touch.startX
      const deltaY = e.touches[0].pageY - this.touch.startY
      if (Math.abs(deltaY) > Math.abs(deltaX)) return
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricList.$el.style.transition = 'all 0s'
      this.$refs.middleL.style.transition = 'all 0s'
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
    },
    middleTouchEnd () {
      let offsetWidth
      let opacity
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currentShow = 'lyric'
        } else {
          offsetWidth = 0
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0
          opacity = 1
          this.currentShow = 'cd'
        } else {
          offsetWidth = -window.innerWidth
        }
      }
      this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricList.$el.style.transition = 'all 0.5s'
      this.$refs.middleL.style.transition = 'all 0.5s'
      this.$refs.middleL.style.opacity = opacity
    },
    end () {
      if (this.mode === playMode.loop) this.loop()
      else this.next()
    },
    loop () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.currentLyric) this.currentLyric.seek()
    },
    // 播放模式改变
    changeMode () {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) list = shuffle(this.sequenceList)
      else list = this.sequenceList
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    resetCurrentIndex (list) {
      let index = list.findIndex((item, index) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    onProgressBarChange (percent) {
      const currentTime = this.currentSong.duration * percent
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) this.togglePlaying()
      if (this.currentLyric) this.currentLyric.seek(currentTime * 1000)
    },
    back () {
      this.setFullScreen(false)
    },
    open () {
      this.setFullScreen(true)
    },
    togglePlaying () {
      this.playing ? this.toPause()
                   : this.toPlay()
      if (this.currentLyric) this.currentLyric.togglePlay()
    },
    toPause () {
      this.setPlaying(!this.playing)
      this.$refs.audio.pause()
    },
    toPlay () {
      this.setPlaying(!this.playing)
      this.$refs.audio.play()
    },
    prev () {
      if (!this.songReady) return
      if (this.playList.length === 1) this.loop()
      else {
        let index = this.currentIndex - 1
        if (index === this.playList.length) index = this.playList.length - 1
        this.setCurrentIndex(index)
        if (!this.playing) this.toPlay()
      }
      this.songReady = false
    },
    next () {
      if (!this.songReady) return
      if (this.playList.length === 1) this.loop()
      else {
        let index = this.currentIndex + 1
        if (index === this.playList.length) index = 0
        this.setCurrentIndex(index)
        if (!this.playing) this.toPlay()
      }
      this.songReady = false
    },
    ready () {
      this.songReady = true
    },
    error () {
      this.songReady = true
    },
    updateTime (e) {
      this.currentTime = e.target.currentTime
    },
    handleLyric ({lineNum, txt}) {
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollToElement(0, 0, 1000)
      }
      this.playingLyric = txt
    },
    _getLyric () {
      this.currentSong._getLyric()
        .then((res) => {
          this.currentLyric = new Lyric(res, this.handleLyric)
          if (this.playing) {
            this.currentLyric.play()
          }
        })
        .catch(() => {
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLineNum = 0
        })
    },
    _formatTime (interval) {
      interval = interval | 0
      const minute = (interval / 60) | 0
      const second = this._pad0(interval % 60)
      return minute + ':' + second
    },
    _pad0 (num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlaying: 'SET_PLAYING',
      setCurrentIndex: 'SET_CURRENTINDEX',
      setPlayMode: 'SET_MODE',
      setPlayList: 'SET_PLAYLIST'
    })
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll,
    PlayListDom
  }
}
</script>

<style lang="stylus" scoped>
  @import "~@/common/stylus/variable"
  @import "~@/common/stylus/mixin"

  .player
    .normal-player
      position fixed
      left 0
      right 0
      top 0
      bottom 0
      z-index 150
      background $color-background
      .background
        position absolute
        left 0
        top 0
        width 100%
        height 100%
        z-index -1
        opacity 0.6
        filter blur(20px)
      .top
        position relative
        margin-bottom 25px
        .back
          position absolute
          top 0
          left 6px
          z-index 50
          .icon-back
            display block
            padding 9px
            font-size $font-size-large-x
            color $color-theme
            transform rotate(-90deg)
        .title
          width 70%
          margin 0 auto
          line-height 40px
          text-align center
          no-wrap()
          font-size $font-size-large
          color $color-text
        .subtitle
          line-height 20px
          text-align center
          font-size $font-size-medium
          color $color-text
      .middle
        position fixed
        width 100%
        top 80px
        bottom 170px
        white-space nowrap
        font-size 0
        .middle-l
          display inline-block
          vertical-align top
          position relative
          width 100%
          height 0
          padding-top 80%
          .cd-wrapper
            position absolute
            left 10%
            top 0
            width 80%
            height 100%
            .cd
              width 100%
              height 100%
              box-sizing border-box
              border 10px solid rgba(255, 255, 255, 0.1)
              border-radius 50%
              &.play
                animation rotate 20s linear infinite
              &.pause
                animation-play-state paused
              .image
                position absolute
                left 0
                top 0
                width 100%
                height 100%
                border-radius 50%

          .playing-lyric-wrapper
            width 80%
            margin 50px auto 0 auto
            overflow hidden
            text-align center
            .playing-lyric
              height 20px
              line-height 20px
              font-size $font-size-medium
              color $color-text-l
        .middle-r
          display inline-block
          vertical-align top
          width 100%
          height 100%
          overflow hidden
          .lyric-wrapper
            width 80%
            margin 0 auto
            overflow hidden
            text-align center
            .text
              line-height 32px
              color $color-text-l
              font-size $font-size-medium
              &.current
                color $color-text
      .bottom
        position absolute
        bottom 50px
        width 100%
        .dot-wrapper
          text-align center
          font-size 0
          .dot
            display inline-block
            vertical-align middle
            margin 0 4px
            width 8px
            height 8px
            border-radius 50%
            background $color-text-ll
            &.active
              width 20px
              border-radius 5px
              background $color-text
        .progress-wrapper
          display flex
          align-items center
          width 80%
          margin 0px auto
          padding 10px 0
          .time
            color $color-text
            font-size $font-size-small
            flex 0 0 30px
            line-height 30px
            width 30px
            &.time-l
              text-align left
            &.time-r
              text-align right
          .progress-bar-wrapper
            flex 1
        .operators
          display flex
          align-items center
          .icon
            flex 1
            color $color-theme
            &.disable
              color $color-theme-d
            i
              font-size 30px
          .i-left
            text-align right
          .i-center
            padding 0 20px
            text-align center
            i
              font-size 40px
          .i-right
            text-align left
          .icon-favorite
            color $color-sub-theme
        .top
          transform translate3d(0, -100px, 0)
        .bottom
          transform translate3d(0, 100px, 0)
    .mini-player
      display flex
      align-items center
      position fixed
      left 0
      bottom 0
      z-index 180
      width 100%
      height 60px
      background $color-highlight-background
      .icon
        flex 0 0 40px
        width 40px
        padding 0 10px 0 20px
        img
          border-radius 50%
          &.play
            animation rotate 10s linear infinite
          &.pause
            animation-play-state paused
      .text
        display flex
        flex-direction column
        justify-content center
        flex 1
        line-height 20px
        overflow hidden
        .name
          margin-bottom 2px
          no-wrap()
          color $color-theme
        .desc
          no-wrap()
          color $color-text-d
      .control
        flex 0 0 30px
        width 30px
        padding 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size 30px
          color $color-theme
        .icon-mini
          font-size 32px
          position absolute
          left 0
          top 0
          z-index -1

  @keyframes rotate
    0%
      transform rotate(0)
    100%
      transform rotate(360deg)
</style>
