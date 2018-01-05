<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import MusicList from '@/components/music-list/music-list'
import { mapGetters } from 'vuex'
import { getSongList } from '@/api/recommend'
import { CODE } from '@/api/config'
import { createSong } from '@/common/js/song'
export default {
  data () {
    return {
      songs: []
    }
  },
  computed: {
    title () {
      return this.disc.dissname
    },
    bgImage () {
      return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
    ])
  },
  created () {
    this._getSongList()
  },
  methods: {
    _getSongList () {
      if (!this.disc.dissid) this.$router.push('/recommend')
      getSongList(this.disc.dissid)
        .then((res) => {
          if (res.code === CODE) {
            this.songs = this._normalizeSongs(res.cdlist[0].songlist)
          }
        })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach(item => {
        if (item.songid && item.albumid) ret.push(createSong(item))
      })
      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>

<style lang="stylus" scoped>
  .slide-enter-active,
  .slide-leave-active
    transition all 0.3
  
  .slide-enter,
  .slide-leave
    transform translate3d(100%, 0, 0)
</style>

