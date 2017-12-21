<template>
  <div id="app">
    <My-header></My-header>
    <Tab></Tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import MyHeader from '@/components/my-header/my-header'
import Tab from '@/components/tab/tab'
export default {
  name: 'app',
  components: {
    MyHeader,
    Tab
  }
}
</script>

<style scoped lang="stylus">
  @import "~@/common/stylus/variable";
  #app
    color: $color-theme
</style>
