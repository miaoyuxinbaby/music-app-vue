<template>
  <div class="recommend">
    <Scroll :data="SongMenu" ref="scroll" class="recommend-content">
      <div>
        <swiper :options="swiperOption" ref="mySwiper">
          <!-- slides -->
          <swiper-slide v-for="item in swiperData" :key="item.id">
            <a :href="item.linkUrl">
              <img :src="item.picUrl" @load="loadImage" class="needsclick slider-wrapper">
            </a>
          </swiper-slide>

          <!-- Optional controls -->
          <div slot="pagination" class="swiper-pagination"></div>
        </swiper>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in SongMenu" :key="item.dissid" class="item">
              <div class="icon">
                <img v-lazy="item.imgurl" width="60" height="60">
              </div>
              <div class="text">
                <h2 v-html="item.creator.name" class="name"></h2>
                <p v-html="item.dissname" class="desc"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div v-show="!SongMenu.length" class="loading-container">
        <Loading></Loading> 
      </div>
    </Scroll>
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { getRecommend, getRecommendSongMenu } from '@/api/recommend'
import { CODE } from '@/api/config'
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
export default {
  name: 'recommend',
  components: {
    swiper,
    swiperSlide,
    Scroll,
    Loading
  },
  data () {
    return {
      swiperData: [],
      SongMenu: [],
      Imageisload: false,
      swiperOption: {
        pagination: {
          el: '.swiper-pagination'
        },
        autoplay: true
      }
    }
  },
  created () {
    this._getRecommend()
    this._getRecommendSongMenu()
  },
  mounted () {

  },
  computed: {
    swiper () {
      return this.$refs.mySwiper.swiper
    }
  },
  methods: {
    _getRecommend () {
      getRecommend()
        .then((res) => {
          if (res.code === CODE) {
            this.swiperData = res.data.slider
          }
        })
    },
    _getRecommendSongMenu () {
      getRecommendSongMenu()
        .then((res) => {
          if (res.code === CODE) {
            this.SongMenu = res.data.list
          }
        }, (err) => {
          console.log(err)
        })
    },
    loadImage () {
      if (this.Imageisload) return
      this.$refs.scroll.refresh()
      this.Imageisload = true
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~@/common/stylus/variable"
  @import "~@/common/stylus/mixin";
  .recommend
    position fixed
    top 88px
    bottom 0
    width 100%
    .recommend-content
      height 100%
      overflow hidden
      .slider-wrapper
        position relative
        width 100%
        overflow hidden
    .recommend-list
      .list-title
        height 40px
        line-height 40px
        text-align center
        font-size $font-size-medium
        color $color-theme
      .item
        display flex
        box-sizing border-box
        align-items center
        padding 0 20px 20px 20px
        .icon
          flex 0 0 60px
          width: 60px
          padding-right: 20px
        .text
          display flex
          flex-direction column
          justify-content center
          flex 1
          line-height 20px
          overflow hidden
          font-size $font-size-medium
          .name
            no-wrap()
            margin-bottom 10px
            color $color-text-ll
          .desc
            no-wrap()
    .loading-container
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
</style>