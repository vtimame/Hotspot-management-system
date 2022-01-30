<template>
  <div class='main-menu'>
    <main-menu-item icon='gg-display-grid' text='Статистика' :compact='compact' />
    <main-menu-item icon='gg-flag-alt' text='Клиенты' :compact='compact' />
    <main-menu-item icon='gg-cloud' text='Зоны' :compact='compact' />
  </div>
</template>

<script>
import MainMenuItem from './MainMenuItem'

export default {
  props: {
    compact: {
      type: Boolean,
      default: false
    },
  },
  components: {
    MainMenuItem
  }
}
</script>

<style lang='scss' scoped>
.main-menu {
  margin-top: 12px;
  flex: 1;
}
</style>
