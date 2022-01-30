<template>
  <div class="zone-events">
    <div class="zone-events__header">
      <div class="zone-events__title">События</div>
      <a-space>
        <a-range-picker
          :placeholder="['Начиная от', 'Заканчивая до']"
          :allow-clear="false"
          format="DD.MM.YYYY"
          :default-value="[
            filter.between.createdAtFrom,
            filter.between.createdAtTo,
          ]"
          @change="onDatesRangeChange"
        />
      </a-space>
    </div>
    <div class="zone-events__content">
      <events-table :events="events" />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { EventsQuery, EventSub } from '~/graphql/common.graphql'
import EventsTable from '~/components/common/EventsTable'

export default {
  components: { EventsTable },
  data() {
    return {
      events: [],
      filter: {
        withoutDebugMessages: true,
        entities: {
          zoneId: Number(this.$route.params.zoneId),
        },
        between: {
          createdAtFrom: moment().clone().startOf('month'),
          createdAtTo: moment().clone().endOf('month'),
        },
      },
    }
  },
  computed: {
    queryFilter: function () {
      return {
        filter: this.filter,
      }
    },
  },
  apollo: {
    events: {
      query: EventsQuery,
      variables() {
        return this.queryFilter
      },
      subscribeToMore: {
        document: EventSub,
        variables() {
          return this.queryFilter
        },
        updateQuery: (previousQueryResult, { subscriptionData }) => {
          return {
            events: [
              subscriptionData.data.eventAdded,
              ...previousQueryResult.events,
            ],
          }
        },
      },
    },
  },
  methods: {
    onDatesRangeChange([createdAtFrom, createdAtTo]) {
      this.filter.between.createdAtFrom = createdAtFrom
      this.filter.between.createdAtTo = createdAtTo
      this.$apollo.queries.events.refetch({ filter: this.filter })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../../node_modules/open-color/open-color';

.zone-events {
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
    padding: 0.5rem 1rem 3rem 1rem;
    max-height: 100%;
    overflow-y: auto;
  }
}
</style>
