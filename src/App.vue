<template>
  <div id="app">
    <My-header></My-header>
    <Tab></Tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import MyHeader from '@/components/my-header/my-header'
import Tab from '@/components/tab/tab'
import Player from '@/components/player/player'
export default {
  name: 'app',
  components: {
    MyHeader,
    Tab,
    Player
  }
}
</script>

<style scoped lang="stylus">
  @import "~@/common/stylus/variable";
  #app
    color: $color-theme
</style>
