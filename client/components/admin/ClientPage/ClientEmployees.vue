<template>
  <base-tab-pane class="employees">
    <div slot="header">
      <div class="d-flex align-items-center justify-content-between">
        <div class="employees__title">Сотрудники</div>
        <div>
          <a-space>
            <a-checkbox v-model="withoutDeleted">Только активные</a-checkbox>
            <a-input
              size="small"
              placeholder="Поиск..."
              v-model="searchValue"
              :style="{ width: '250px' }"
            />
            <a-button size="small" type="dashed" @click="openEmployeeDrawer"
              >Добавить сотрудика</a-button
            >
          </a-space>
        </div>
      </div>
    </div>
    <employees-list
      :client-id="clientId"
      :search="searchValue"
      :with-deleted="!withoutDeleted"
      @selectEditInstance="setEditInstance"
      @editEmployee="editEmployee($event)"
    />
    <employee-drawer
      :client-id="clientId"
      :visible="employeeDrawer.visible"
      :edit-instance="employeeDrawer.editInstance"
      @close="closeEmployeeDrawer"
    />
  </base-tab-pane>
</template>

<script>
import BaseTabPane from '~/components/admin/ClientPage/BaseTabPane.vue'
import EmployeeDrawer from '~/components/common/EmployeeDrawer.vue'
import EmployeesList from '~/components/admin/ClientPage/EmployeesList.vue'

export default {
  data: () => ({
    employeeDrawer: {
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
  components: { EmployeesList, EmployeeDrawer, BaseTabPane },
  methods: {
    editEmployee(employee) {
      this.employeeDrawer.editInstance = employee
      this.openEmployeeDrawer()
    },
    openEmployeeDrawer() {
      this.employeeDrawer.visible = true
    },
    closeEmployeeDrawer() {
      this.employeeDrawer.visible = false
      this.employeeDrawer.editInstance = null
    },
    setEditInstance(zone) {
      this.employeeDrawer.editInstance = zone
      this.openZoneDrawer()
    },
  },
}
</script>

<style lang="scss" scoped>
.employees {
  &__title {
    font-weight: 600;
    font-size: 1.1rem;
  }
}
</style>
