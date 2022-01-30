<template>
  <div>
    <a-table
      :columns="table.columns"
      :data-source="sessions"
      size="middle"
      :row-key="getRowKey"
      :style="{ borderBottom: 'none' }"
      :pagination="{
        defaultPageSize: 15,
      }"
    >
      <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
        <session-details :session="record" />
      </p>
      <span slot="login" slot-scope="text, record">{{
        record.auth ? record.auth.login : ''
      }}</span>
      <span slot="startedAt" slot-scope="text">{{ formatDate(text) }}</span>
      <span slot="expiresAt" slot-scope="text">{{ formatDate(text) }}</span>
      <span slot="timeLeft" slot-scope="text, el">
        <session-timer :date="el['expiresAt']" />
      </span>
    </a-table>
  </div>
</template>

<script>
import moment from 'moment'
import {
  GuestSessionsQuery,
  GuestSessionAdded,
  GuestSessionDisabled,
} from '~/graphql/admin/client/guest-sessions'
import SessionTimer from '~/components/common/SessionTimer'
import SessionDetails from '~/components/admin/ZonePage/SessionDetails'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    scopedSlots: { customRender: 'id' },
  },
  { title: 'Логин', scopedSlots: { customRender: 'login' } },
  { title: 'IP', dataIndex: 'ip', key: 'ip' },
  { title: 'mac', dataIndex: 'device.mac', key: 'deviceMac' },
  {
    title: 'Выдана',
    dataIndex: 'startedAt',
    key: 'startedAt',
    scopedSlots: { customRender: 'startedAt' },
  },
  {
    title: 'Действует до',
    dataIndex: 'expiresAt',
    key: 'expiresAt',
    scopedSlots: { customRender: 'expiresAt' },
  },
  {
    title: 'Завершится через',
    key: 'timeLeft',
    scopedSlots: { customRender: 'timeLeft' },
  },
]

export default {
  props: {
    variables: {
      type: Object,
      required: true,
    },
    search: {
      type: String,
      required: false,
      default: '',
    },
    zoneId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      sessionDetails: {
        visible: false,
        instance: null,
      },
      guestSessions: [],
      table: {
        columns,
      },
    }
  },
  computed: {
    queryVariables: function () {
      return this.variables
    },
    sessions: function () {
      const r = new RegExp(this.search.toLowerCase())
      return this.guestSessions.filter(
        (s) => r.test(s?.ip) || r.test(s?.device?.mac) || r.test(s?.auth?.login)
      )
    },
  },
  mounted() {
    this.$apollo.queries.guestSessions.subscribeToMore({
      document: GuestSessionDisabled,
      variables: { zoneId: this.zoneId },
      updateQuery: (previousQueryResult, { subscriptionData }) => {
        const guestSessions = previousQueryResult.guestSessions.filter(
          (s) =>
            Number(s.id) !==
            Number(subscriptionData.data['guestSessionDisabled'].id)
        )
        return {
          guestSessions,
        }
      },
    })
  },
  apollo: {
    guestSessions: {
      query: GuestSessionsQuery,
      variables() {
        return this.queryVariables
      },
      subscribeToMore: {
        document: GuestSessionAdded,
        variables() {
          return { zoneId: Number(this.queryVariables.filter.zoneId) }
        },
        updateQuery: (previousQueryResult, { subscriptionData }) => {
          const { guestSessions } = previousQueryResult
          const { guestSessionAdded } = subscriptionData.data
          return {
            guestSessions: [guestSessionAdded, ...guestSessions],
          }
        },
      },
    },
  },
  methods: {
    getRowKey(record) {
      return `${record.id}`
    },
    formatDate(date) {
      return moment(date).format('DD.MM.YYYY HH:mm:ss')
    },
  },
  components: {
    SessionDetails,
    SessionTimer,
  },
}
</script>
