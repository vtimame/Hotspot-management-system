<template>
  <div>
    <a-table
      size="small"
      :columns="columns"
      :data-source="events"
      :rowKey="(record) => record.id"
      :expandRowByClick="true"
      :pagination="{
        defaultPageSize: 15,
      }"
    >
      <span slot="createdAt" slot-scope="el">{{
        formatDate(el['createdAt'])
      }}</span>
    </a-table>
  </div>
</template>

<script>
import momentMixin from '~/mixins/moment.mixin'

export default {
  mixins: [momentMixin],
  props: {
    events: {
      type: Array,
    },
  },
  data() {
    return {
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'eventId',
          width: '70px',
          // slots: { title: 'customTitle' },
          // scopedSlots: { customRender: 'name' },
        },
        {
          title: 'Дата события',
          key: 'createdAt',
          scopedSlots: { customRender: 'createdAt' },
          width: '200px',
        },
        {
          title: 'Сообщение',
          dataIndex: 'message',
          key: 'message',
        },
      ],
    }
  },
}
</script>
