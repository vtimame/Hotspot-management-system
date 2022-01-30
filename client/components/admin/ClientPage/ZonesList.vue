<template>
  <div>
    <zones-list
      :zones="zones"
      :loading="$apollo.queries.zones.loading"
      @open-zone="openZone"
    />
  </div>
</template>

<script>
import { Menu } from 'ant-design-vue'
import {
  ZonesQuery,
  ZoneAddedSub,
  ZoneUpdatedSub,
} from '~/graphql/admin/client/zones'
import SimpleThumbnail from '~/components/common/SimpleThumbnail'
import FIcon from '~/components/common/FIcon'
import ZonesList from '~/components/common/ZonesList'

export default {
  components: {
    FIcon,
    SimpleThumbnail,
    ZonesList,
    'a-menu': Menu,
    'a-menu-item': Menu.Item,
    'a-menu-divider': Menu.Divider,
  },
  props: {
    clientId: {
      type: Number,
      required: true,
    },
    withDeleted: {
      type: Boolean,
      default: false,
    },
    search: {
      type: String,
      required: false,
    },
  },
  data: () => ({
    zones: [],
  }),
  computed: {
    loadingZones: function () {
      return this.$apollo.queries.zones.loading
    },
    emptyList: function () {
      return !this.loadingZones && this.withDeleted
        ? this.zones.length === 0
        : this.filteredZones.length === 0
    },
    filteredZones: function () {
      const search = new RegExp(this.search.trim().toLowerCase())
      return this.zones.filter((zone) => {
        const name = zone.name.toString().trim().toLowerCase()
        const interfaceName = zone.interfaceName.toString().trim().toLowerCase()
        const authTypes = zone.authTypes

        return (search.test(name) ||
          search.test(interfaceName) ||
          authTypes.includes(this.search.trim().toLowerCase())) &&
          this.withDeleted
          ? true
          : !zone['disabledAt']
      })
    },
  },
  mounted() {
    
    this.$apollo.queries.zones.subscribeToMore({
      document: ZoneUpdatedSub,
      updateQuery: (previousQueryResult, { subscriptionData }) => {
        const { zones } = previousQueryResult
        const updatedZone = subscriptionData.data['zoneUpdated']
        zones.map((zone) => {
          if (zone.id === updatedZone.id) {
            return updatedZone
          }
          return zone
        })

        return {
          zones,
        }
      },
    })
  },
  apollo: {
    zones: {
      query: ZonesQuery,
      variables() {
        return {
          input: {
            withDeleted: true,
          },
          filter: {
            clientId: this.clientId,
          },
        }
      },
      subscribeToMore: {
        document: ZoneAddedSub,
        variables() {
          return { clientId: this.clientId }
        },
        updateQuery: (previousQueryResult, { subscriptionData }) => {
          return {
            zones: [
              ...previousQueryResult.zones,
              subscriptionData.data['zoneAdded'],
            ],
          }
        },
      },
    },
  },
  methods: {
    isDisabled(zone) {
      return zone['disabledAt']
    },
    openZone(id) {
      this.$router.push({
        name: 'admin-client-id-zone-zoneId',
        params: { id: this.clientId.toString(), zoneId: id.toString() },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.zone {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
