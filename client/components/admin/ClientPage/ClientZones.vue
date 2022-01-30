<template>
  <base-tab-pane class="zones">
    <div slot="header">
      <div class="d-flex align-items-center justify-content-between">
        <div class="zones__title">Зоны</div>
        <div>
          <a-space>
            <a-checkbox v-model="withoutDeleted">Только активные</a-checkbox>
            <a-input
              size="small"
              placeholder="Поиск..."
              v-model="searchValue"
              :style="{ width: '250px' }"
            />
            <a-button size="small" type="dashed" @click="openZoneDrawer"
              >Добавить зону</a-button
            >
          </a-space>
        </div>
      </div>
    </div>
    <zones-list
      :client-id="clientId"
      :search="searchValue"
      :with-deleted="!withoutDeleted"
      @selectEditInstance="setEditInstance($event)"
    />
    <zone-drawer
      :client-id="clientId"
      :visible="zoneDrawer.visible"
      :edit-instance="zoneDrawer.editInstance"
      @close="closeZoneDrawer"
    />
  </base-tab-pane>
</template>

<script>
import BaseTabPane from '~/components/admin/ClientPage/BaseTabPane.vue'
import ZoneDrawer from '~/components/common/ZoneDrawer.vue'
import ZonesList from '~/components/admin/ClientPage/ZonesList.vue'

export default {
  data: () => ({
    zoneDrawer: {
      visible: false,
      editInstance: null,
    },
    searchValue: '',
    withoutDeleted: true,
  }),
  props: {
    clientId: {
      type: Number,
      required: true,
    },
  },
  components: { ZonesList, ZoneDrawer, BaseTabPane },
  methods: {
    openZoneDrawer() {
      this.zoneDrawer.visible = true
    },
    closeZoneDrawer() {
      this.zoneDrawer.visible = false
      this.zoneDrawer.editInstance = null
    },
    setEditInstance(zone) {
      this.zoneDrawer.editInstance = zone
      this.openZoneDrawer()
    },
  },
}
</script>

<style lang="scss" scoped>
.zones {
  &__title {
    font-weight: 600;
    font-size: 1.1rem;
  }
}
</style>
