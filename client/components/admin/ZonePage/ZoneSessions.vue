<template>
  <div class="zone-sessions">
    <div class="zone-sessions__header">
      <div class="zone-sessions__title">Сессии</div>
      <a-space v-if="filter">
        <a-checkbox v-model="withoutDeleted">Только активные</a-checkbox>
        <a-input placeholder="IP/mac/Логин" v-model="search" />
        <a-range-picker
          :placeholder="['Начиная от', 'Заканчивая до']"
          :allow-clear="false"
          format="DD.MM.YYYY"
          :default-value="[filter.issuedFrom, filter.issuedTo]"
          @change="onDatesRangeChange"
        />
      </a-space>
    </div>
    <div class="zone-sessions__content">
      <sessions-list
        v-if="filter"
        :variables="queryVariables"
        :search="search"
        :zone-id="zoneId"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { DatePicker } from 'ant-design-vue'
import SessionsList from '~/components/admin/ZonePage/SessionsList'

export default {
  mounted() {
    this.filter = {
      zoneId: this.zoneId,
      issuedFrom: moment().clone().startOf('month'),
      issuedTo: moment().clone().endOf('month'),
      withDeleted: false,
    }
  },
  data() {
    return {
      search: '',
      filter: null,
      withoutDeleted: true,
    }
  },
  computed: {
    queryVariables: function () {
      return {
        filter: { ...this.filter, withDeleted: !this.withoutDeleted },
      }
    },
    zoneId: function () {
      return Number(this.$route.params.zoneId)
    },
  },
  methods: {
    onDatesRangeChange([issuedFrom, issuedTo]) {
      this.filter.issuedFrom = issuedFrom
      this.filter.issuedTo = issuedTo
    },
  },
  components: {
    SessionsList,
    'a-range-picker': DatePicker.RangePicker,
  },
}
</script>

<style lang="scss" scoped>
@import '../../../node_modules/open-color/open-color';

.zone-sessions {
  background-color: white;
  border-left: 1px solid $oc-gray-3;
  border-right: 1px solid $oc-gray-3;
  border-bottom: 1px solid $oc-gray-3;
  border-radius: 0 0 5px 5px;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  overflow-y: hidden;

  &__header {
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    font-size: 1.2rem;
    font-weight: 600;
  }

  &__content {
    padding: 0.5rem 1rem;
    max-height: 80%;
    overflow-y: auto;
  }
}
</style>
