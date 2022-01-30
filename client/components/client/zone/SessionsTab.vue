<template>
  <div class="sessions-tab">
    <div class="sessions-tab__header">
      <div class="sessions-tab__title">Сессии</div>
      <a-space v-if="filter !== null">
        <a-range-picker
          :placeholder="['Начиная от', 'Заканчивая до']"
          :allow-clear="false"
          :locale="datePickerLocale"
          format="DD.MM.YYYY"
          :default-value="[filter.issuedFrom, filter.issuedTo]"
          @change="onDatesRangeChange"
        />
      </a-space>
    </div>
    <div class="sessions-tab__body">
      <sessions-list
        v-if="filter !== null"
        :filter="filter"
        @time-left="onTimeLeft"
      />
    </div>
  </div>
</template>

<script>
import SessionsList from '~/components/client/zone/SessionsList.vue'
import moment from 'moment'
import datePickerMixin from '~/mixins/date-picker.mixin'

export default {
  mixins: [datePickerMixin],
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
      // myGuestSessions: [],
    }
  },
  computed: {
    zoneId: function () {
      return Number(this.$route.params.id)
    },
  },
  // apollo: {
  //   myGuestSessions: {
  //     query: MyGuestSessionsQuery,
  //     variables() {
  //       return { input: this.filter }
  //     },
  //   },
  // },
  methods: {
    onDatesRangeChange([issuedFrom, issuedTo]) {
      this.filter.issuedFrom = issuedFrom
      this.filter.issuedTo = issuedTo
    },
    onTimeLeft(el) {
      this.myGuestSessions = this.myGuestSessions.filter(
        (s) => Number(s.id) !== Number(el.id)
      )
    },
  },
  components: {
    SessionsList,
  },
}
</script>

<style lang="scss" scoped>
.sessions-tab {
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
