<template>
  <div class="zone-instance">
    <div v-if="!zoneIsLoaded" class="container py-3">Loading...</div>
    <div v-else-if="zoneNotFound" class="container py-3">zone not found</div>
    <div v-else class="container py-3 zone-instance__container">
      <div class="zone-instance__container__header">
        <div>
          <div class="zone-instance__container__title">{{ zone.name }}</div>
          <span
            >Клиент:
            <a
              href="#"
              @click.prevent="
                $router.push({
                  name: 'admin-client-id',
                  params: { id: zone.client.id },
                })
              "
              >{{ zone.client.name }}</a
            ></span
          >
        </div>
        <a-space>
          <a-button type="dashed" @click="editZone">Изменить</a-button>
          <a-button type="dashed" @click="toggleDisabled">{{
            zoneIsDisabled ? 'Включить' : 'Отключить'
          }}</a-button>
        </a-space>
      </div>
      <div class="zone-instance__container__body">
        <div class="zone-instance__card-header">
          <a-tabs v-model="tab" :style="{ borderBottom: 'none' }">
            <a-tab-pane tab="Сессии" key="sessions" />
            <a-tab-pane tab="События" key="events" />
          </a-tabs>
          <a-badge
            :status="zoneIsDisabled ? 'error' : 'success'"
            :text="zoneIsDisabled ? 'Зона отключена' : 'Зона включена'"
          />
        </div>
        <component :is="`zone-${tab}`" />
      </div>
    </div>

    <zone-drawer
      :client-id="Number($route.params.id)"
      :visible="zoneDrawer.visible"
      :edit-instance="zoneDrawer.editInstance"
      @close="closeZoneDrawer"
    />
  </div>
</template>

<script>
import {
  ZoneQuery,
  ZoneUpdatedSub,
  DeleteZoneMut,
  RestoreZoneMut,
} from '~/graphql/admin/client/zone-instance'
import ZoneDrawer from '~/components/common/ZoneDrawer.vue'
import { Tabs } from 'ant-design-vue'
import ZoneSessions from './ZoneSessions.vue'
import ZoneEvents from './ZoneEvents.vue'

export default {
  props: {
    zoneId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      tab: 'sessions',
      zone: null,
      zoneDrawer: {
        visible: false,
        editInstance: null,
      },
    }
  },
  computed: {
    zoneIsLoaded: function () {
      return !this.$apollo.queries.zone.loading
    },
    zoneIsExists: function () {
      return this.zoneIsLoaded && this.zone !== null
    },
    zoneNotFound: function () {
      return this.zoneIsLoaded && !this.zone
    },
    zoneIsDisabled: function () {
      return this.zoneIsExists && this.zone['disabledAt']
    },
  },
  apollo: {
    zone: {
      query: ZoneQuery,
      variables() {
        return {
          id: this.zoneId,
          input: {
            withDeleted: true,
          },
        }
      },
      subscribeToMore: {
        document: ZoneUpdatedSub,
        updateQuery: (previousQueryResult, { subscriptionData }) => {
          const { zone } = previousQueryResult
          const {
            data: { zoneUpdated },
          } = subscriptionData
          if (zone.id === zoneUpdated.id) {
            return {
              zone: zoneUpdated,
            }
          }
        },
      },
    },
  },
  methods: {
    openZoneDrawer() {
      this.zoneDrawer.visible = true
    },
    closeZoneDrawer() {
      this.zoneDrawer.visible = false
    },
    editZone() {
      this.zoneDrawer.editInstance = this.zone
      this.openZoneDrawer()
    },
    async toggleDisabled() {
      let mutation
      const message = {
        type: 'success',
        text: 'Зона включена',
      }

      if (this.zoneIsDisabled) {
        mutation = RestoreZoneMut
      } else {
        mutation = DeleteZoneMut
        message.type = 'error'
        message.text = 'Зона отключена'
      }

      try {
        await this.$apollo.mutate({
          mutation,
          variables: {
            id: Number(this.zone.id),
          },
        })

        this.$message[message.type](message.text)
      } catch (error) {
        console.log(error)
      }
    },
  },
  components: {
    ZoneDrawer,
    ZoneSessions,
    ZoneEvents,
    'a-tabs': Tabs,
    'a-tab-pane': Tabs.TabPane,
  },
}
</script>

<style lang="scss">
@import '../../../node_modules/open-color/open-color';

.zone-instance {
  height: 100%;

  .ant-tabs-bar {
    border-bottom: none;
    margin-bottom: 0;
  }

  &__card {
    &-header {
      background-color: white;
      border: 1px solid $oc-gray-3;
      border-radius: 5px 5px 0 0;
      padding: 0 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  &__container {
    height: 100%;
    overflow-y: hidden;
    display: flex;
    flex-direction: column;

    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &__title {
      font-weight: 600;
      font-size: 1.5rem;
    }

    &__body {
      flex: 1;
      overflow-y: hidden;
      margin-top: 1rem;
    }
  }
}
</style>
