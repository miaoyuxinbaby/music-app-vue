<template>
<transition name="slide">
  <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list> 
</transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from '@/api/singer'
import { CODE } from '@/api/config'
import { createSong } from '@/common/js/song'
import MusicList from '@/components/music-list/music-list'
export default {
  data () {
    return {
      songs: []
    }
  },
  components: {
    MusicList
  },
  computed: {
    title () {
      return this.singer.name
    },
    bgImage () {
      return this.singer.imgUrl
    },
    ...mapGetters([
      'singer'
    ])
  },
  created () {
    this._getSingerDetail()
  },
  methods: {
    _getSingerDetail () {
      if (!this.singer.id) return this.$router.push('/singer')
      getSingerDetail(this.singer.id)
        .then((res) => {
          if (res.code === CODE) {
            this.songs = this._normalizeSongs(res.data.list)
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
  
  .slide-enter-active,
  .slide-leave-active
    transition all 0.3s
  .slide-enter,
  .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>