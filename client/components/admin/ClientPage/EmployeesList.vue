<template>
  <div>
    <employees-list

      :employees="clientEmployees"
      :loading="this.$apollo.queries.clientEmployees.loading"
      @editEmployee="editEmployee($event)"
    />
  </div>
</template>

<script>
import { Menu } from 'ant-design-vue'
import {
  ClientEmployeesQuery,

} from '~/graphql/admin/client/employees'
import SimpleThumbnail from '~/components/common/SimpleThumbnail'
import FIcon from '~/components/common/FIcon'
import EmployeesList from '~/components/common/EmployeesList'

export default {
  components: {
    FIcon,
    SimpleThumbnail,
    EmployeesList,
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
    clientEmployees: [],
  }),
  
  computed: {
    loadingEmployees: function () {
      return this.$apollo.queries.clientEmployees.loading
    },
    emptyList: function () {
      return !this.loadingEmployees && this.withDeleted
        ? this.clientEmployees.length === 0
        : this.filteredZones.length === 0
    },
    filteredZones: function () {
      return true
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
    
  },
  apollo: {
    clientEmployees: {
      query: ClientEmployeesQuery,
      variables() {
        return {
          input: {
            withDeleted: true,
            clientId: this.clientId,
          },
        
        }
      },
      
    },
  },
  methods: {
    

    editEmployee(e){
      this.$emit('editEmployee',e)
    },
    isDisabled(zone) {
      return zone['disabledAt']
    },
    // openZone(id) {
    //   this.$router.push({
    //     name: 'admin-client-id-zone-zoneId',
    //     params: { id: this.clientId.toString(), zoneId: id.toString() },
    //   })
    // },
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
