<template>
  <div v-if="user" class="user-layout">
    <aside-section />
    <a-config-provider :locale="locale">
      <Nuxt />
    </a-config-provider>
  </div>
  <div v-else class="user-layout--loading">
    <jumper />
  </div>
</template>

<script>
import { AuthUserQuery } from '~/graphql/admin.graphql'
import AsideSection from '~/components/admin/AdminLayout/AsideSection.vue'
import Jumper from '~/components/common/jumper'
import locale from 'ant-design-vue/lib/locale-provider/ru_RU'

export default {
  name: 'user-layout',
  middleware: ['user-auth'],
  components: { Jumper, AsideSection },
  data() {
    return {
      authUser: null,
      locale,
    }
  },
  apollo: {
    authUser: {
      query: AuthUserQuery,
    },
  },
  computed: {
    user: function () {
      return this.$store.getters['user/instance']
    },
  },
  watch: {
    authUser: function (user) {
      if (user !== null) {
        this.$store.dispatch('user/loadUserInstance', user)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~open-color/open-color';

.user-layout {
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
    height: 100vh;
  }
}

.dark-mode {
  .user-layout {
    background-color: $oc-gray-8;
  }
}
</style>
