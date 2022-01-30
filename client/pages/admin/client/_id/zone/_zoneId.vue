<template>
  <div class="zone-page">
    <zone-instance :zone-id="Number($route.params.zoneId)" />
  </div>
</template>

<script>
import ZoneInstance from '~/components/admin/ZonePage/ZoneInstance'
export default {
  name: 'admin-zone-id',
  components: { ZoneInstance },
  layout: 'admin',
  middleware: ['user-auth'],
}
</script>

<style lang="scss" scoped>
.zone-page {
  flex: 1;
}
</style>
