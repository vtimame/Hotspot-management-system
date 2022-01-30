<template>
  <div class="client-layout">
    <div v-if="clientIsLoaded && client" class="container client-instance">
      <header class="header">
        <div
          class="client-name"
          :class="{ 'client-name--is-not-main-page': isNotMainPage }"
        >
          <transition name="fade">
            <div
              v-if="isNotMainPage"
              @click="$router.push({ name: 'client' })"
              :style="{
                position: 'absolute',
                left: '5px',
                top: '8px',
                cursor: 'pointer',
              }"
            >
              <f-icon type="chevron-left" size="30" />
            </div>
          </transition>
          <div class="name">{{ client.surname }} {{ client.name }}</div>
          <!--          <div>{{ client.email }} - {{ client.phoneNumber }}</div>-->
          <div>{{ company.name }}</div>
        </div>
        <a-space>
          <a-button type="dashed" @click="logout">Выйти</a-button>
        </a-space>
      </header>
      <div class="body">
        <a-config-provider :locale="locale">
          <Nuxt />
        </a-config-provider>
      </div>
    </div>
    <div v-else class="client-layout--loading">
      <jumper />
    </div>
  </div>
</template>

<script>
import { ClientQuery } from '~/graphql/client.graphql'
import Jumper from '~/components/common/jumper'
import FIcon from '~/components/common/FIcon'
import locale from 'ant-design-vue/lib/locale-provider/ru_RU'

export default {
  name: 'client-layout',
  components: { FIcon, Jumper },
  middleware: ['client-auth'],
  data() {
    return {
      authClient: null,
      tab: 'zones',
      locale,
    }
  },
  computed: {
    company: function () {
      return this.client?.company || { name: 'Компания не найдена' }
    },
    clientIsLoaded: function () {
      return !this.$apollo.queries.authClient.loading
    },
    client: function () {
      return this.$store.getters['client/instance']
    },
    isNotMainPage: function () {
      return this.$route.name !== 'client'
    },
  },
  apollo: {
    authClient: {
      query: ClientQuery,
    },
  },
  methods: {
    async logout() {
      if (typeof window !== 'undefined') {
        const userJwt = localStorage.getItem('user-jwt')
        const fromClientId = localStorage.getItem('from-client')

        if (userJwt) {
          await this.$apolloHelpers.onLogout()
          await this.$apolloHelpers.onLogin(userJwt)

          await this.$router.push(
            fromClientId && !isNaN(Number(fromClientId))
              ? {
                  name: 'admin-client-id',
                  params: { id: fromClientId },
                }
              : { name: 'admin-dashboard' }
          )

          localStorage.removeItem('user-jwt')
          localStorage.removeItem('from-client')
        } else {
          await this.$apolloHelpers.onLogout()
          await this.$router.push('/')
        }
      }
      this.$store.dispatch('client/loadClientInstance', null)
    },
  },

  watch: {
    authClient: function (instance) {
      this.$store.dispatch('client/loadClientInstance', {
        ...instance,
        id: Number(instance.id),
      })
    },
  },
}
</script>

<style lang="scss">
@import '~open-color/open-color';

.client-layout {
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  display: flex;
  background-color: rgb(244, 247, 249);
  transition: background-color 150ms ease-in-out;

  &--loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
  }

  .client-instance {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 1.5rem 0;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .client-name {
        position: relative;
        transition: all 0.3s;

        &--is-not-main-page {
          padding-left: 2.7rem;
        }
      }

      .name {
        font-size: 1.5rem;
        font-weight: 600;
        line-height: 1.5rem;
      }
    }

    .body {
      margin-top: 1rem;
      flex: 1;
      max-height: 100%;
      overflow-y: hidden;
    }
  }
}
</style>
