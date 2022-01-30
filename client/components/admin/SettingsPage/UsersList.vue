<template>
  <div class="users-list">
    <a-table
      size="small"
      :columns="table.columns"
      :data-source="users"
      :row-key="(record) => record.id"
    >
      <span slot="employee" slot-scope="user"
        >{{ user.surname }} {{ user.name }}</span
      >
      <span slot="status" slot-scope="user">
        <a-badge v-if="user['disabledAt']" status="error" text="Отключен" />
        <a-badge v-else status="success" text="Активен" />
      </span>
      <span slot="actions" slot-scope="user">
        <a-space>
          <a-button
            type="dashed"
            size="small"
            @click="$emit('change-user', user)"
            >Изменить</a-button
          >
          <a-button
            v-if="!isMe(user)"
            :type="user['disabledAt'] ? 'primary' : 'danger'"
            size="small"
            @click="toggleDisabled(user)"
            >{{ user['disabledAt'] ? 'Включить' : 'Отключить' }}</a-button
          >
          <a-tooltip v-else placement="topRight">
            <template slot="title"
              >👌&nbsp;&nbsp;&nbsp;Нельзя просто так взять и отключить самого
              себя</template
            >
            <a-button type="disabled" disabled size="small">Отключить</a-button>
          </a-tooltip>
        </a-space>
      </span>
    </a-table>
  </div>
</template>

<script>
import { List, Menu, Dropdown, Tooltip } from 'ant-design-vue'
import SimpleThumbnail from '~/components/common/SimpleThumbnail'
import FIcon from '~/components/common/FIcon'
import {
  UserAddedSub,
  UserUpdatedSub,
  DeleteUserMut,
  RestoreUserMut,
  UsersQuery,
} from '~/graphql/admin/settings/users'

export default {
  data() {
    return {
      users: [],
      table: {
        columns: [
          {
            title: 'ID',
            dataIndex: 'id',
            width: '70px',
          },
          {
            title: 'Сотрудник',
            scopedSlots: { customRender: 'employee' },
          },
          {
            title: 'Алиас',
            dataIndex: 'alias',
          },
          {
            title: 'Email',
            dataIndex: 'email',
          },
          {
            title: 'Номер телефона',
            dataIndex: 'phoneNumber',
          },
          {
            title: 'Статус',
            scopedSlots: { customRender: 'status' },
          },
          {
            scopedSlots: { customRender: 'actions' },
            align: 'right',
          },
        ],
      },
      usersQueryVariables: {
        withoutDeleted: false,
      },
    }
  },
  computed: {
    me: function () {
      return this.$store.getters['user/instance']
    },
  },
  apollo: {
    $subscribe: {
      userUpdated: {
        query: UserUpdatedSub,
        result() {
          this.$apollo.queries.users.refetch({
            input: {
              withDeleted: !this.usersQueryVariables.withoutDeleted,
            },
          })
        },
      },
    },
    users: {
      query: UsersQuery,
      variables() {
        return {
          input: {
            withDeleted: !this.usersQueryVariables.withoutDeleted,
          },
        }
      },
      subscribeToMore: {
        document: UserAddedSub,
        updateQuery: (previousQueryResult, { subscriptionData }) => {
          return {
            users: [
              ...previousQueryResult.users,
              subscriptionData.data['userAdded'],
            ],
          }
        },
      },
    },
  },
  methods: {
    isMe: function (user) {
      return Number(this.me.id) === Number(user.id)
    },
    async toggleDisabled(user) {
      const mutation = user['disabledAt'] ? RestoreUserMut : DeleteUserMut
      try {
        await this.$apollo.mutate({
          mutation,
          variables: {
            id: Number(user.id),
          },
        })

        this.$message[user['disabledAt'] ? 'success' : 'error'](
          `Пользователь ${user['disabledAt'] ? 'включен' : 'отключен'}`
        )
      } catch (error) {
        console.log(error)
      }
    },
  },
  components: {
    FIcon,
    SimpleThumbnail,
    'a-list': List,
    'a-tooltip': Tooltip,
    'a-list-item': List.Item,
    'a-dropdown': Dropdown,
    'a-menu': Menu,
    'a-menu-item': Menu.Item,
    'a-menu-divider': Menu.Divider,
  },
}
</script>

<style lang="scss" scoped>
.users-list {
  //
}
</style>
