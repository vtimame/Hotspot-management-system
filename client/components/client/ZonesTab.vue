<template>
  <div class="zones-tab">
    <div class="zones-tab__header">
      <div class="zones-tab__title">Зоны</div>
      <a-space>
        <a-button type="dashed" size="small" @click="addNewZone"
          >Добавить зону</a-button
        >
      </a-space>
    </div>
    <div class="zones-tab__body">
      <zones-list
        :zones="authClientZones"
        :loading="!zonesIsLoaded"
        @open-zone="openZone"
      />
    </div>
  </div>
</template>

<script>
import { ZonesQuery } from '~/graphql/client.graphql'
import ZonesList from '../common/ZonesList.vue'

export default {
  data() {
    return {
      authClientZones: [],
    }
  },
  apollo: {
    authClientZones: {
      query: ZonesQuery,
    },
  },
  computed: {
    zonesIsLoaded: function () {
      return !this.$apollo.queries.authClientZones.loading
    },
  },
  methods: {
    addNewZone() {
      this.$notification.open({
        message: 'Добавить новую зону',
        duration: 50000,
        description:
          'Чтобы добавить новую зону, обратитесь в поддержку по номеру: +7 (812) XXX-XX-XX',
        onClick: () => {
          console.log('Notification Clicked!')
        },
      })
    },
    openZone(id) {
      this.$router.push({ name: 'client-zone-id', params: { id } })
    },
  },
  components: {
    ZonesList,
  },
}
</script>

<style lang="scss" scoped>
.zones-tab {
  flex: 1;
  max-height: 100%;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__title {
    font-weight: 600;
    font-size: 1.2rem;
  }

  &__body {
    flex: 1;
    max-height: 100%;
    overflow-y: auto;
    margin-top: 0.5rem;
  }
}
</style>
