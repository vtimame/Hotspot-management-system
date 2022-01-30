<template>
  <div class="sessions-list">
    <a-table
      size="small"
      :columns="table.columns"
      :data-source="myGuestSessions"
      :row-key="(record) => record.id"
    >
      <span slot="login" slot-scope="el">
        {{ getLogin(el) }}
      </span>
      <span slot="timeLeft" slot-scope="el">
        <session-timer :date="el['expiresAt']" />
      </span>
      <span slot="startedAt" slot-scope="el">{{
        formatDate(el['startedAt'])
      }}</span>
      <span slot="expiresAt" slot-scope="el">{{
        formatDate(el['expiresAt'])
      }}</span>
    </a-table>
  </div>
</template>

<script>
import { MyGuestSessionsQuery } from '~/graphql/client.graphql'
import SessionTimer from '~/components/common/SessionTimer.vue'
import momentMixin from '~/mixins/moment.mixin'

export default {
  mixins: [momentMixin],
  props: {
    filter: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      myGuestSessions: [],
      table: {
        columns: [
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
            key: 'startedAt',
            scopedSlots: { customRender: 'startedAt' },
          },
          {
            title: 'Действует до',
            key: 'expiresAt',
            scopedSlots: { customRender: 'expiresAt' },
          },
          {
            title: 'Завершится через',
            key: 'timeLeft',
            scopedSlots: { customRender: 'timeLeft' },
          },
        ],
      },
    }
  },
  apollo: {
    myGuestSessions: {
      query: MyGuestSessionsQuery,
      variables() {
        return {
          input: this.filter,
        }
      },
    },
  },
  methods: {
    getLogin(el) {
      return el?.auth?.login || ''
    },
  },
  components: {
    SessionTimer,
  },
}
</script>
