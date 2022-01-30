<template>
  <aside class="aside-section">
    <div v-if="authUser !== null" class="aside-section__user">
      <!--      <div class="aside-section__user-avatar">-->
      <!--        <img-->
      <!--          src="/static/user.svg"-->
      <!--          :alt="`${authUser.surname} ${authUser.name}`"-->
      <!--        />-->
      <!--      </div>-->
      <div class="aside-section__user-meta">
        <div class="aside-section__user-name">
          {{ authUser.surname }} {{ authUser.name }}
        </div>
        <div class="aside-section__user-alias">{{ authUser.email }}</div>
      </div>
    </div>
    <div :style="{ padding: '12px' }">
      <a-checkbox
        v-model="clientsOptions.withoutDeleted"
        @change="onDeletedChange"
        >Только активные</a-checkbox
      >
    </div>
    <a-input
      v-model="clientsOptions.searchValue"
      placeholder="Поиск"
      class="aside-section__search"
    />
    <div class="aside-section__main-menu">
      <a-menu class="menu" :selected-keys="selectedKeys" @click="onMenuClick">
        <a-menu-item
          v-for="client in filteredClients"
          class="item"
          :key="client.id"
        >
          <div class="d-flex justify-content-between align-items-center">
            <span>{{ client.name }}</span>
            <a-badge :status="client['disabledAt'] ? 'error' : 'success'" />
          </div>
        </a-menu-item>
      </a-menu>
    </div>
    <div :style="{ padding: '12px' }">
      <a-button type="dashed" block @click="createClient = true"
        >Добавить клиента</a-button
      >
      <create-client-drawer
        :visible="createClient"
        @close="createClient = false"
      />
    </div>
    <div class="aside-section__system-menu">
      <a-menu :selectable="false" :style="{ borderRight: 'none' }">
        <a-menu-item @click="$router.push({ name: 'admin-settings' })">
          <a-icon type="setting" />
          <span>Настройки</span>
        </a-menu-item>
        <a-menu-item @click="logout">
          <a-icon type="logout" />
          <span>Выйти</span>
        </a-menu-item>
      </a-menu>
    </div>
  </aside>
</template>

<script>
import { Menu } from 'ant-design-vue'
import { AuthUserQuery } from '~/graphql/admin.graphql'
import CreateClientDrawer from '~/components/admin/AdminLayout/AsideSection/ClientDrawer'
import {
  ClientsQuery,
  ClientAddedSub,
  ClientUpdatedSub,
} from '~/graphql/admin/client'

export default {
  name: 'aside-section',
  data: () => ({
    authUser: null,
    clients: [],
    clientsOptions: {
      withoutDeleted: true,
      searchValue: '',
    },
    createClient: false,
  }),
  computed: {
    filteredClients: function () {
      const search = new RegExp(this.clientsOptions.searchValue.toLowerCase())
      return this.clients.filter((client) => {
        return search.test(client.name.toString().toLowerCase())
      })
    },
    selectedKeys: function () {
      return this.$route.name === 'admin-client-id' ||
        this.$route.name === 'admin-client-id-zone-zoneId'
        ? [this.$route.params.id]
        : []
    },
  },
  apollo: {
    $subscribe: {
      clientUpdated: {
        query: ClientUpdatedSub,
        result() {
          this.$apollo.queries.clients.refetch()
        },
      },
    },
    authUser: {
      query: AuthUserQuery,
    },
    clients: {
      query: ClientsQuery,
      subscribeToMore: {
        document: ClientAddedSub,
        updateQuery: (previousQueryResult, { subscriptionData }) => {
          return {
            clients: [
              ...previousQueryResult.clients,
              subscriptionData.data['clientAdded'],
            ],
          }
        },
      },
    },
  },
  components: {
    CreateClientDrawer,
    'a-menu-item': Menu.Item,
  },
  methods: {
    onMenuClick(value) {
      this.$router.push({ name: 'admin-client-id', params: { id: value.key } })
    },
    onDeletedChange(event) {
      this.$apollo.queries.clients.refetch({
        input: {
          withDeleted: !event.target.checked,
        },
      })
    },
    async logout() {
      try {
        await this.$apolloHelpers.onLogout()
        await this.$router.push('/')
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../../node_modules/open-color/open-color';
@import '../../../assets/scss/scrollbars';

.aside-section {
  width: 400px;
  min-width: 400px;
  background-color: white;
  border-right: 1px solid $oc-gray-3;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  &__search {
    border-left: none;
    border-right: none;
    border-radius: 0;
    padding-left: 14px;
    padding-right: 14px;

    &:focus {
      box-shadow: none;
    }
  }

  &__user {
    border-bottom: 1px solid $oc-gray-3;
    padding: 12px;
    display: flex;
    align-items: center;

    &-avatar {
      width: 48px;
      height: 48px;
      border-radius: 100%;
      overflow: hidden;

      img {
        width: 100%;
        height: auto;
      }
    }

    &-meta {
      //margin-left: 0.5rem;
    }

    &-name {
      font-weight: 600;
      font-size: 1rem;
      line-height: 1.1rem;
    }

    &-alias {
      font-size: 0.85rem;
      line-height: 0.9rem;
    }
  }

  &__main-menu {
    flex: 1;
    overflow-y: auto;
    @include scrollbars(3px, $oc-gray-4);
    .menu {
      border-right: none;

      .item {
        height: 30px;
        line-height: 30px;
        margin-bottom: 0;
      }
    }
  }

  &__system-menu {
    border-top: 1px solid $oc-gray-3;
  }
}
</style>
