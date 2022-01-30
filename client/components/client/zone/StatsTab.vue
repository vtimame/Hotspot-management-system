<template>
  <div class="stats-tab">
    <div class="stats-tab__header">
      <div class="stats-tab__title">Статистика подключений</div>
      <a-space>
        <a-select v-model="select.value" :style="{ width: '150px' }">
          <a-select-option value="today">Сегодня</a-select-option>
          <a-select-option value="yesterday">Вчера</a-select-option>
          <a-select-option value="week">За неделю</a-select-option>
          <a-select-option value="month">За месяц</a-select-option>
          <a-select-option value="year">За год</a-select-option>
          <a-select-option value="allTime" disabled
            >За все время</a-select-option
          >
          <a-select-option value="period" disabled>За период</a-select-option>
        </a-select>
      </a-space>
    </div>
    <div class="stats-tab__body">
      <div v-if="$apollo.queries['myStatsOfConnections'].loading">
        <jumper />
      </div>
      <div v-else>
        <client-only>
          <stats-of-connections :stats="myStatsOfConnections" />
        </client-only>
      </div>
    </div>
  </div>
</template>

<script>
import { MyStatsOfConnectionsQuery } from '~/graphql/client.graphql'
import moment from 'moment'
import Jumper from '~/components/common/jumper'
import StatsOfConnections from '~/components/client/stats/StatsOfConnections'
import { Select } from 'ant-design-vue'

export default {
  components: {
    StatsOfConnections,
    Jumper,
    'a-select': Select,
    'a-select-option': Select.Option,
  },
  data() {
    return {
      filter: {
        issuedFrom: moment().clone().startOf('day'),
        issuedTo: moment().clone().endOf('day'),
      },
      select: {
        value: 'today',
      },
      myStatsOfConnections: [],
    }
  },
  apollo: {
    myStatsOfConnections: {
      query: MyStatsOfConnectionsQuery,
      variables() {
        return {
          filter: {
            zoneId: Number(this.$route.params.id),
            period: this.select.value,
          },
        }
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.stats-tab {
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
