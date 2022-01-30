<template>
  <div>
    <div v-if="session">
      <div class="row">
        <div class="session-details__auth col-6">
          <div class="session-details__title">Авторизация</div>
          <div>ID: {{ auth.id }}</div>
          <div>Выдана: {{ formatDate(auth.startedAt) }}</div>
          <div>Истекает: {{ formatDate(auth.expiresAt) }}</div>
        </div>
        <div class="session-details__device col-6">
          <div class="session-details__title">Устройство</div>
          <div>ID: {{ session.device.id }}</div>
          <div>
            Модель: {{ deviceModel.vendor || '?' }}
            {{ deviceModel.model || '?' }}
          </div>
          <div>Браузер: {{ browser }}</div>
          <div>ОС: {{ os }}</div>
        </div>
        <div class="col-12 d-flex justify-content-end">
          <a-space>
            <a-button type="dashed" @click="dropGuestSession"
              >Завершить сессию</a-button
            >
            <a-button type="dashed" @click="dropGuestAuth"
              >Завершить авторизацию</a-button
            >
          </a-space>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import {
  DropGuestSession,
  DropGuestAuth,
} from '~/graphql/admin/client/guest-sessions'

export default {
  props: {
    session: {
      type: Object,
      required: false,
    },
  },
  computed: {
    auth: function () {
      return this.session?.auth || {}
    },
    browser: function () {
      const browser = this.session?.device?.ua?.browser
      return `${browser?.name} ${browser?.version}`
    },
    os: function () {
      const os = this.session?.device?.ua?.os
      return `${os?.name} ${os?.version}`
    },
    deviceModel: function () {
      const device = this.session?.device?.ua?.device
      return {
        model: device?.model,
        type: device?.type,
        vendor: device?.vendor,
      }
    },
  },
  methods: {
    formatDate(date) {
      return moment(date).format('DD.MM.YYYY HH:mm:ss')
    },
    async dropGuestSession() {
      try {
        await this.$apollo.mutate({
          mutation: DropGuestSession,
          variables: {
            id: Number(this.session.id),
          },
        })
        this.$message.success('Сессия завершена')
        this.$emit('close')
      } catch (error) {
        console.log(error)
      }
    },
    async dropGuestAuth() {
      try {
        await this.$apollo.mutate({
          mutation: DropGuestAuth,
          variables: {
            id: Number(this.session.id),
          },
        })
        this.$message.success('Авторизация завершена')
        this.$emit('close')
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../../node_modules/open-color/open-color';

.session-details {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
  }

  &__title {
    font-weight: 600;
  }

  &__auth,
  &__device {
    padding: 0.5rem 0;
  }
}
</style>
