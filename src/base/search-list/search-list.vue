<template>
  <div class="search-list">
    <ul>
      <li 
        class="search-item" 
        v-for="(item, index) in searches"
        :key="index"
        @click="selectItem(item)">
        <span class="text">{{item}}</span>
        <span class="icon">
          <i class="icon-delete" @click.stop="deleteOne(item)"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      searches: {
        type: Array,
        default: []
      }
    },
    methods: {
      selectItem (item) {
        this.$emit('select', item)
      },
      deleteOne (item) {
        this.$emit('deleteOne', item)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~@/common/stylus/variable"

  .search-list
    .search-item
      display flex
      align-items center
      height 40px
      overflow hidden
      &.list-enter-active, &.list-leave-active
        transition all 0.1s
      &.list-enter, &.list-leave-to
        height 0
      .text
        flex 1
        color $color-text-l
      .icon
        extend-click()
        .icon-delete
          font-size $font-size-small
          color $color-text-d
</style>
