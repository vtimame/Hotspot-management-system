<template>
  <a-drawer
    class="user-drawer"
    :visible="visible"
    :closable="false"
    :mask-closable="false"
    :body-style="{ padding: 0 }"
    placement="bottom"
    height="fill-content"
    :after-visible-change="afterVisibleChange"
  >
    <div class="user-drawer__content container py-3">
      <div class="row">
        <div class="col-6 offset-3">
          <header class="user-drawer__header">
            {{ editInstance ? 'Изменить' : 'Добавить' }} пользователя
          </header>
          <form @submit.prevent="onFormSubmit">
            <div class="mb-2 row">
              <div
                class="col-6"
                :class="{ 'has-error': $v.form.surname.$error }"
              >
                <div class="mb-1">Фамилия</div>
                <a-input
                  v-model="$v.form.surname.$model"
                  placeholder="Введите фамилию"
                  ref="surnameInput"
                />
              </div>
              <div class="col-6" :class="{ 'has-error': $v.form.name.$error }">
                <div class="mb-1">Имя</div>
                <a-input
                  v-model="$v.form.name.$model"
                  placeholder="Введите имя"
                />
              </div>
            </div>
            <div class="mb-2 row">
              <div class="col-6" :class="{ 'has-error': $v.form.alias.$error }">
                <div class="mb-1">Алиас</div>
                <a-input
                  v-model="$v.form.alias.$model"
                  placeholder="Введите алиас"
                />
              </div>
              <div class="col-6" :class="{ 'has-error': $v.form.email.$error }">
                <div class="mb-1">Почтовый адрес</div>
                <a-input
                  v-model="$v.form.email.$model"
                  placeholder="Введите почтовый адрес"
                />
              </div>
            </div>
            <div class="mb-2 row">
              <div
                class="col-6"
                :class="{ 'has-error': $v.form.phoneNumber.$error }"
              >
                <div class="mb-1">Номер телефона</div>
                <a-input
                  v-model="$v.form.phoneNumber.$model"
                  placeholder="Введите номер телефона"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-12 d-flex justify-content-end">
                <a-space>
                  <a-button @click="$emit('close')">Отмена</a-button>
                  <a-button
                    type="primary"
                    html-type="submit"
                    :disabled="$v.form.$invalid"
                    >Сохранить</a-button
                  >
                </a-space>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </a-drawer>
</template>

<script>
import { required, email, numeric, minLength } from 'vuelidate/lib/validators'
import { CreateUserMut, UpdateUserMut } from '~/graphql/admin/settings/users'

const defaultUserForm = {
  name: '',
  surname: '',
  alias: '',
  email: '',
  phoneNumber: '',
}

export default {
  name: 'user-drawer',
  data() {
    return {
      form: defaultUserForm,
    }
  },
  validations: {
    form: {
      name: { required },
      surname: { required },
      email: { required, email },
      alias: { required },
      phoneNumber: { required, numeric, minLength: minLength(10) },
    },
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    editInstance: {
      type: Object,
      required: false,
    },
  },
  methods: {
    afterVisibleChange(visible) {
      if (visible) {
        if (this.editInstance) {
          this.form = {
            name: this.editInstance.name,
            surname: this.editInstance.surname,
            alias: this.editInstance.alias,
            email: this.editInstance.email,
            phoneNumber: this.editInstance.phoneNumber,
          }
        } else this.form = defaultUserForm
        setTimeout(() => {
          this.$refs.surnameInput.focus()
        }, 150)
      } else {
        this.$v.form.$reset()
      }
    },
    async onFormSubmit() {
      let message = 'Пользователь добавлен'
      let mutation = CreateUserMut
      let variables = {
        input: this.form,
      }

      if (this.editInstance) {
        message = 'Пользователь обновлен'
        mutation = UpdateUserMut
        variables.id = Number(this.editInstance.id)
      }

      try {
        await this.$apollo.mutate({
          mutation,
          variables,
        })

        this.$message.success(message)
        this.$emit('close')
      } catch (error) {
        if (error.graphQLErrors) {
          this.$message.error(error.graphQLErrors[0].message)
        } else {
          this.$message.error('Во время запроза произошла ошибка')
        }
      }
    },
  },
}
</script>

<style lang="scss">
.user-drawer {
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
