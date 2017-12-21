<template>
  <div class="recommend">
    <div class="recommend-content">
      <swiper :options="swiperOption" ref="mySwiper">
        <!-- slides -->
        <swiper-slide v-for="item in swiperData" :key="item.id">
          <a :href="item.linkUrl">
            <img class="needsclick slider-wrapper" :src="item.picUrl" >
          </a>
        </swiper-slide>

        <!-- Optional controls -->
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
      <div class="recommend-list">
        <h1 class="list-title">热门歌单推荐</h1>
        <ul>

        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { getRecommend, getRecommendSongMenu } from '@/api/recommend'
import { CODE } from '@/api/config'
export default {
  name: 'recommend',
  components: {
    swiper,
    swiperSlide
  },
  data () {
    return {
      swiperOption: {
        pagination: {
          el: '.swiper-pagination'
        },
        autoplay: true
      },
      swiperData: []
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
          console.log(res)
        }, (err) => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~@/common/stylus/variable"
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
</style>