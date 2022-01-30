<template>
  <a-drawer
    class="create-client"
    :visible="visible"
    :closable="false"
    :mask-closable="false"
    :body-style="{ padding: 0 }"
    placement="bottom"
    height="fill-content"
    :after-visible-change="afterVisibleChange"
  >
    <div class="create-client__body container">
      <div class="row">
        <div class="col-6 offset-3">
          <header class="create-client__header">Добавить клиента</header>
          <form class="row" @submit.prevent="onSubmit">
            <div class="col-6 mb-2" :class="{ 'has-error': $v.name.$error }">
              <div class="mb-1">Имя</div>
              <a-input
                v-model.trim="$v.name.$model"
                placeholder="Введите имя клиента"
                ref="nameInput"
              />
            </div>
            <div
              class="col-12 d-flex justify-content-start align-items-center mt-3"
            >
              <a-space>
                <a-button @click="$emit('close')">Отмена</a-button>
                <a-button
                  type="primary"
                  html-type="submit"
                  :disabled="$v.$invalid"
                  >Сохранить</a-button
                >
              </a-space>
            </div>
          </form>
        </div>
      </div>
    </div>
  </a-drawer>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
import { CreateClientMut } from '~/graphql/admin/client'

export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    deviceInstance: {
      type: Object,
      required: false,
    },
  },
  data: () => ({
    name: '',
  }),
  validations: {
    name: {
      required,
    },
  },
  methods: {
    afterVisibleChange(visible) {
      if (visible) {
        setTimeout(() => {
          this.$refs.nameInput.focus()
        }, 150)
      } else {
        setTimeout(() => {
          this.name = ''
          this.$v.$reset()
        }, 150)
      }
    },
    async onSubmit() {
      try {
        const variables = {
          input: {
            name: this.name,
          },
        }

        await this.$apollo.mutate({
          mutation: CreateClientMut,
          variables,
        })

        this.$message.success(`Клиент "${this.name}" добавлен`)
        this.$emit('close')
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.create-client {
  &__body {
    padding: 1rem 0;
  }

  &__header {
    font-weight: 600;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }
}
</style>
