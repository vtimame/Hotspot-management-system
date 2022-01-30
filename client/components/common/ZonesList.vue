<template>
  <div>
    <transition name="fade" mode="in-out">
      <div v-if="loading">
        <jumper />
      </div>
      <div v-else>
        <a-list
          v-if="zones.length > 0"
          :grid="{ gutter: 16, column: 4 }"
          :data-source="zones"
        >
          <a-table
            :columns="table.columns"
            :data-source="zones"
            :row-key="(record) => record.id"
            size="small"
            :pagination="false"
          >
            <span slot="authTypes" slot-scope="{ authTypes }">
              <a-tag v-for="authType in authTypes" :key="authType">{{
                authType
              }}</a-tag>
            </span>
            <span slot="authLifetime" slot-scope="{ authLifetime }">{{
              optionTitle(authLifetime)
            }}</span>
            <span slot="sessionLifetime" slot-scope="{ sessionLifetime }">{{
              optionTitle(sessionLifetime)
            }}</span>
            <span slot="sessionTimeout" slot-scope="{ sessionTimeout }">{{
              optionTitle(sessionTimeout)
            }}</span>
            <span slot="actions" slot-scope="{ id }">
              <a href="#" @click.prevent="$emit('open-zone', id)">Подробно</a>
            </span>
          </a-table>
        </a-list>
        <empty-list
          v-else
          :config="{
            icon: '/router.svg',
            title: 'Здесь пока нет ни одной зоны',
          }"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import declineWord from 'decline-word'
import Jumper from '~/components/common/jumper'
import EmptyList from '~/components/admin/ClientPage/EmptyList'

export default {
  props: {
    zones: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      table: {
        columns: [
          {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: '70px',
          },
          {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: 'Типы авторизации',
            key: 'authTypes',
            scopedSlots: { customRender: 'authTypes' },
          },
          {
            title: 'Длительность авторизации',
            key: 'authLifetime',
            scopedSlots: { customRender: 'authLifetime' },
          },
          {
            title: 'Длительность сессии',
            key: 'sessionLifetime',
            scopedSlots: { customRender: 'sessionLifetime' },
          },
          {
            title: 'Таймаут',
            key: 'sessionTimeout',
            scopedSlots: { customRender: 'sessionTimeout' },
          },
          {
            key: 'actions',
            scopedSlots: { customRender: 'actions' },
          },
        ],
      },
    }
  },
  methods: {
    optionTitle(time) {
      if (time <= 60) {
        return this.declineOption(time, 'Секунд', 'а', 'ы')
      } else if (time > 60 && time <= 3599) {
        return this.declineOption(time / 60, 'Минут', 'а', 'ы')
      } else if (time > 3599 && time <= 86399) {
        return this.declineOption(time / 60 / 60, 'Час', '', 'а', 'ов')
      } else {
        return this.declineOption(time / 60 / 60 / 24, 'Д', 'ень', 'ня', 'ней')
      }
    },
    declineOption(
      time,
      mainPart,
      endingFormOne,
      endingForTwo,
      endingForFive = ''
    ) {
      return `${time} ${declineWord(
        time,
        mainPart,
        endingFormOne,
        endingForTwo,
        endingForFive
      )}`
    },
  },
  components: { EmptyList, Jumper },
}
</script>
