import { mapGetters, mapActions } from 'vuex'

export const playListMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted () {
    this.handlePlaylist(this.playList)
  },
  activated () {
    // keep-alive组件切换回来会触发这个钩子
    this.handlePlaylist(this.playList)
  },
  watch: {
    playList (newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist () {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

export const searchMixin = {
  data () {
    return {
      query: ''
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    blurInput () {
      this.$refs.searchBox.blur()
    },
    saveSearch () {
      this.saveSearchHistory(this.query)
    },
    onQueryChange (query) {
      this.query = query
    },
    addQuery (val) {
      this.$refs.searchBox.setQuery(val)
    },
    ...mapActions([
      'saveSearchHistory',
      'deletaSearchHistory'
    ])
  }
}

export const favoriteMixin = {
  computed: {
    ...mapGetters([
      'favoriteList'
    ])
  },
  methods: {
    getFavoriteIcon (song) {
      if (this.isFavorite(song)) return 'icon-favorite'
      return 'icon-not-favorite'
    },
    toggleFavorite (song) {
      if (this.isFavorite(song)) this.deleteFavoriteList(song)
      else this.saveFavoriteList(song)
    },
    isFavorite (song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }
}
