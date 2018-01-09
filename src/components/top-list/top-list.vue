<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs" :rank="rank"></music-list> 
  </transition>
</template>

<script>
import { createSong } from '@/common/js/song'
import { mapGetters } from 'vuex'
import MusicList from '@/components/music-list/music-list'
import { getMusicList } from '@/api/rank'
import { CODE } from '@/api/config'
export default {
  data () {
    return {
      songs: [],
      rank: true
    }
  },
  components: {
    MusicList
  },
  computed: {
    title () {
      return this.topList.topTitle
    },
    bgImage () {
      if (this.songs.length) return this.songs[0].image
      else return this.topList.picUrl
    },
    ...mapGetters([
      'topList'
    ])
  },
  created () {
    this._getMusicList()
  },
  methods: {
    _getMusicList () {
      if (!this.topList.id) return this.$router.push('/rank')
      getMusicList(this.topList.id)
        .then(res => {
          if (res.code === CODE) this.songs = this._normalizeSongs(res.songlist)
        })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach(item => {
        const musicData = item.data
        if (musicData.songid && musicData.albumid) ret.push(createSong(musicData))
      })
      return ret
    }
  }
}
</script>

<style lang="stylus" scoped>
  
  .slide-enter-active,
  .slide-leave-active
    transition all 0.3s
  .slide-enter,
  .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>