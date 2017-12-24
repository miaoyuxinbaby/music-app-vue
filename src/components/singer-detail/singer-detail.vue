<template>
<transition name="slide">
  <div class="singer-detail">
    
  </div>
</transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from '@/api/singer'
import { CODE } from '@/api/config'
import { createSong } from '@/common/js/song'
export default {
  data () {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters([
      'singer'
    ])
  },
  created () {
    console.log(this.singer)
    this._getSingerDetail()
  },
  methods: {
    _getSingerDetail () {
      if (!this.singer.id) return this.$router.push('/singer')
      getSingerDetail(this.singer.id)
        .then((res) => {
          if (res.code === CODE) {
            console.log(res.data)
            this.songs = this._normalizeSongs(res.data.list)
            console.log(this.songs)
          }
        })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach(item => {
        let {musicData} = item
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~@/common/stylus/variable"
  .singer-detail
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    background $color-background
  
  .slide-enter-active,
  .silde-leave-active
    transition all 0.3s
  .slide-enter,
  .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>