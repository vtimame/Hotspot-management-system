<template>
  <div v-if="$apollo.queries.client.loading">loading...</div>
  <div
    v-else-if="!$apollo.queries.client.loading && client !== null"
    class="container py-3 client-instance"
  >
    <header class="client-instance__header">
      <div>
        <div class="client-instance__name">{{ client.name }}</div>
      </div>
      <a-space>
        <a-button
          :type="clientIsDisabled ? 'disabled' : 'dashed'"
          @click="openEmployeeDrawer"
          :disabled="clientIsDisabled"
          >Войти как клиент</a-button
        >
        <a-button type="dashed" @click="toggleDisabled">{{
          clientIsDisabled ? 'Включить' : 'Отключить'
        }}</a-button>
      </a-space>
    </header>
    <div class="client-instance__body">
      <div class="client-instance__tabs">
        <a-tabs v-model="currentTab">
          <a-tab-pane key="zones" tab="Зоны" />
          <a-tab-pane key="pages" tab="Страницы" />
          <a-tab-pane key="stats" tab="Статистика" />
          <a-tab-pane key="employees" tab="Сотрудники" />
        </a-tabs>
        <a-badge
          :status="clientIsDisabled ? 'error' : 'success'"
          :text="clientIsDisabled ? 'Клиент отключен' : 'Клиент включен'"
        />
      </div>
      <div class="client-instance__content">
        <component :is="`client-${currentTab}`" :clientId="id" />
      </div>
    </div>
    <login-employee-drawer
      :visible="visibleLoginEmployeeDrawer"
      :clientId="id"
      @close="closeEmployeeDrawer"
      @click="loginAsClient"
    />
  </div>
  <div v-else-if="!$apollo.queries.client.loading && !client">
    Client not found
  </div>
</template>

<script>
import { Tabs, Menu } from 'ant-design-vue'
import { ClientQuery } from '~/graphql/admin/client'
import ClientStats from '~/components/admin/ClientPage/ClientStats'
import ClientZones from '~/components/admin/ClientPage/ClientZones'
import ClientPages from '~/components/admin/ClientPage/ClientPages'
import ClientEmployees from '~/components/admin/ClientPage/ClientEmployees'
import LoginEmployeeDrawer from '~/components/common/LoginEmployeeDrawer.vue'
import {
  UpdateClientMut,
  DeleteClientMut,
  RestoreClientMut,
  LoginAsClientMut,
} from '~/graphql/admin/client'

export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      visibleLoginEmployeeDrawer: false,
      client: null,
      currentTab: 'zones',
      changePasswordModal: false,
      newPassword: {
        password: '',
        sendMail: true,
      },
    }
  },
  methods: {},
  computed: {
    changePasswordButtonIsDisabled: function () {
      return this.newPassword.password.length === 0
    },
    clientIsDisabled: function () {
      return this.client?.disabledAt !== null
    },
  },
  apollo: {
    client: {
      query: ClientQuery,
      variables() {
        return { id: this.id, input: { withDeleted: true } }
      },
    },
  },
  components: {
    ClientStats,
    ClientZones,
    ClientPages,
    ClientEmployees,
    'a-tabs': Tabs,
    'a-tab-pane': Tabs.TabPane,
    'a-menu': Menu,
    'a-menu-item': Menu.Item,
    'a-menu-divider': Menu.Divider,
    LoginEmployeeDrawer,
  },
  methods: {
    openEmployeeDrawer() {
      this.visibleLoginEmployeeDrawer = true
    },
    closeEmployeeDrawer() {
      this.visibleLoginEmployeeDrawer = false
    },
    async toggleDisabled() {
      const variables = {
        id: this.id,
      }

      await this.$apollo.mutate({
        mutation: this.clientIsDisabled ? RestoreClientMut : DeleteClientMut,
        variables,
      })

      this.$message[this.clientIsDisabled ? 'error' : 'success'](
        `Клиент ${this.clientIsDisabled ? 'отключен' : 'включен'}`
      )
    },
    async loginAsClient(id) {
      if (typeof window !== 'undefined') {
        try {
          const {
            data: {
              loginAsClient: { jwt },
            },
          } = await this.$apollo.mutate({
            mutation: LoginAsClientMut,
            variables: {
              id: Number(id),
            },
          })

          const userJwt = this.$apolloHelpers.getToken()
          localStorage.setItem('user-jwt', userJwt)
          localStorage.setItem('from-client', this.client.id)

          await this.$apolloHelpers.onLogout()
          await this.$apolloHelpers.onLogin(jwt)
          await this.$router.push({ name: 'client' })
        } catch (error) {
          console.log(error)
        }
      }
    },
  },
  watch: {
    changePasswordModal: function (visible) {
      if (visible) {
        setTimeout(() => {
          this.$refs.newPasswordInput.focus()
        }, 150)
      } else {
        setTimeout(() => {
          this.newPassword.password = ''
          this.newPassword.sendMail = true
        }, 150)
      }
    },
  },
}
</script>

<style lang="scss">
@import '../../../node_modules/open-color/open-color';

.client-instance {
  height: 100%;
  display: flex;
  flex-direction: column;

  .ant-tabs-bar {
    margin: 0 !important;
    border-bottom: none;
    user-select: none;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__name {
    font-size: 1.5rem;
    font-weight: 600;
  }

  &__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: hidden;
  }

  &__tabs {
    padding: 0 1rem 0 1rem;
    background-color: white;
    border: 1px solid $oc-gray-3;
    margin-top: 1rem;
    border-radius: 5px 5px 0 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__content {
    flex: 1;
    overflow-y: hidden;
    height: 100%;
  }
}

.change-password {
  &__header {
    padding: 0.5rem 1rem;
    border-bottom: 1px solid $oc-gray-3;
    font-weight: 600;
  }

  &__body {
    padding: 0.5rem 1rem;
  }
}
</style>
