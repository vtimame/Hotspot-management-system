<template>
  <div>
    <transition name="fade" mode="in-out">
      <div v-if="loading">
        <jumper />
      </div>
      <div v-else>
        <a-list
          v-if="employees.length > 0"
          :grid="{ gutter: 16, column: 4 }"
          :data-source="employees"
        >
          <a-table
            :columns="table.columns"
            :data-source="employees"
            :row-key="(record) => record.id"
            size="small"
            :pagination="false"
          >
            <span slot="actions" slot-scope="employee">
              <a-space>
                <a-button
                  type="dashed"
                  size="small"
                  @click="editEmployee(employee)"
                  >Изменить</a-button
                >
                <a-button
                  v-if="!employee['disabledAt']"
                  type="danger"
                  size="small"
                  :style="{ paddingLeft: '1.7rem', paddingRight: '1.7rem' }"
                  @click="toggleDisabled(employee)"
                  >Удалить</a-button
                >
                <a-button
                  v-else
                  type="primary"
                  size="small"
                   @click="toggleDisabled(employee)"
                  >Восстановить</a-button
                >
              </a-space>
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
import {
  DeleteClientEmployeeMut,
  RestoreClientEmployeeMut,
} from '~/graphql/admin/client/employees'
export default {
  props: {
    employees: {
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
            title: 'Имя',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: 'Фамилия',
            dataIndex: 'surname',
            key: 'surname',
          },
          {
            title: 'Отчество',
            dataIndex: 'patronymic',
            key: 'patronymic',
          },
          {
            title: 'Телефон',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
          },
          {
            title: 'email',
            dataIndex: 'email',
            key: 'email',
          },
          {
            title: 'компания',
            dataIndex: 'company.name',
            key: 'company.name',
          },
          {
            key: 'actions',
            scopedSlots: { customRender: 'actions' },
            align: 'right',
          },
        ],
      },
    }
  },
  methods: {
    editEmployee(e) {
      this.$emit('editEmployee',e)
    },
    async toggleDisabled(employee) {
      let mutation
      const message = {
        type: 'success',
        text: 'Сотрудник восстановлен',
      }

      if (employee.disabledAt) {
        mutation = RestoreClientEmployeeMut
      } else {
        mutation = DeleteClientEmployeeMut
        message.type = 'error'
        message.text = 'Сотрудник удален'
      }

      try {
        await this.$apollo.mutate({
          mutation,
          variables: {
            id: Number(employee.id),
          },
        })

        this.$message[message.type](message.text)
      } catch (error) {
        console.log(error)
      }
    },
  },
  mounted(){
    
  },
  components: { EmptyList, Jumper },
}
</script>
