<template>
  <div class="client-page">
    <client-instance :id="Number($route.params.id)" />
  </div>
</template>

<script>
import ClientInstance from '~/components/admin/ClientPage/ClientInstance'
export default {
  name: 'amin-client',
  components: { ClientInstance },
  layout: 'admin',
  middleware: ['user-auth'],
  methods: {},
}
</script>

<style lang="scss" scoped>
.client-page {
  flex: 1;
}
</style>
