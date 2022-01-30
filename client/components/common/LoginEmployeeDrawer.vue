<template>
  <a-drawer
    class="login-employee-drawer"
    :visible="visible"
    :closable="false"
    :mask-closable="false"
    :body-style="{ padding: 0 }"
    placement="bottom"
    height="fill-content"
    width='256'
    
  >
    <div class="employee-drawer__content container py-3">
      <div class="row">
        <div class="col-10 offset-1">
          <header class="employee-drawer__header">Выбрать сотрудника</header>
          <transition name="fade" mode="in-out">
            <div v-if="this.$apollo.queries.clientEmployees.loading">
              <jumper />
            </div>
            <div v-else>
              <a-list
                size="small"
                v-if="clientEmployees.length > 0"
                :grid="{ gutter: 16, column: 4 }"
                :data-source="clientEmployees"
              >
                <a-table
                  :columns="table.columns"
                  :data-source="clientEmployees"
                  :row-key="(record) => record.id"
                  :width="'100%'"
                  size="small"
                >
                  <span slot="actions" slot-scope="employee">
                    <a-space>
                      <a-button
                        type="dashed"
                        size="small"
                        @click="selectEmployee(employee.id)"
                        >Выбрать</a-button
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
          <div class="d-flex justify-content-end">
            <a-space>
              <a-button @click="$emit('close')">Отмена</a-button>
            </a-space>
          </div>
        </div>
      </div>
    </div>
  </a-drawer>
</template>

<script>
import { ClientEmployeesQuery } from '~/graphql/admin/client/employees'
import Jumper from '~/components/common/jumper'
export default {
  data() {
    return {
      clientEmployees: [],
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
            title: 'Действия',
            key: 'actions',
            scopedSlots: { customRender: 'actions' },
            align: 'right',
            width: '100px',
          },
        ],
      },
    }
  },
  components:{Jumper},
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    clientId: {
      type: Number,
      required: true,
    },
  },
  methods:{
      selectEmployee(id){
          this.$emit('click',id)
      }
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
}
</script>

<style lang="scss">
.login-employee-drawer {
  &__content {
    //
  }

  &__header {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 0.3rem;
  }
}
</style>
