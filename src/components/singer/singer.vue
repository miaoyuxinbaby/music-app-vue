<template>
  <div class="singer" ref="singer">
    <singer-list-view :data="singerList" @select="selectSinger" ref="list"></singer-list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import { getSingerList } from '@/api/singer'
import { CODE } from '@/api/config'
import Singer from '@/common/js/singer'
import SingerListView from '@/base/SingerListView/SingerListView'
import { mapMutations } from 'vuex'
import { playListMixin } from '@/common/js/mixin'

const HOT_TITLE = '热门'
const HOT_SINGER_LENGTH = 10

export default {
  mixins: [playListMixin],
  data () {
    return {
      singerList: []
    }
  },
  components: {
    SingerListView
  },
  created () {
    this._getSingerList()
  },
  methods: {
    handlePlaylist (playingList) {
      const bottom = playingList.length > 0 ? '50px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.list.refresh()
    },
    selectSinger (item) {
      this.setSinger(item)
      this.$router.push({
        path: `/singer/${item.id}`
      })
    },
    _getSingerList () {
      getSingerList()
        .then((res) => {
          if (res.code === CODE) {
            this.singerList = this._formatSingerList(res.data.list)
          }
        })
    },
    _formatSingerList (Array) {
      let map = {
        hot: {
          title: HOT_TITLE,
          items: []
        }
      }
      // 拼接map
      Array.forEach((item, index) => {
        if (index < HOT_SINGER_LENGTH) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }

        const KIND = item.Findex
        if (!map[KIND]) {
          map[KIND] = {
            title: KIND,
            items: []
          }
        }
        map[KIND].items.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })

      // 处理map成[[hot....], [ret....]]
      const hot = []
      const ret = []
      for (let k in map) {
        let val = map[k]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_TITLE) {
          hot.push(val)
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
      }
      return hot.concat(ret)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  }
}
</script>

<style lang="stylus" scoped>
    .singer
      position: fixed
      top: 88px
      bottom: 0
      width: 100%
</style>