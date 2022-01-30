<template>
  <a-drawer
    class="employee-drawer"
    :visible="visible"
    :closable="false"
    :mask-closable="false"
    :body-style="{ padding: 0 }"
    placement="bottom"
    height="fill-content"
    :after-visible-change="afterVisibleChange"
  >
    <div class="employee-drawer__content container py-3">
      <div class="row">
        <div class="col-8 offset-2">
          <header class="employee-drawer__header">
            {{ editInstance ? 'Изменить' : 'Добавить' }} сотрудника
          </header>
          <form class="employee-drawer__form" @submit.prevent="onFormSubmit">
            <div class="row mb-3">
              <div class="col-4" :class="{ 'has-error': $v.form.name.$error }">
                <div class="mb-1">Имя</div>
                <a-input
                  v-model="$v.form.name.$model"
                  placeholder="Введите имя"
                  ref="nameInput"
                />
              </div>
              <div
                class="col-4"
                :class="{ 'has-error': $v.form.surname.$error }"
              >
                <div class="mb-1">Фамилия</div>
                <a-input
                  v-model="$v.form.surname.$model"
                  placeholder="Введите фамилию"
                  ref="surnameInput"
                />
              </div>
              <div
                class="col-4"
                :class="{ 'has-error': $v.form.patronymic.$error }"
              >
                <div class="mb-1">Отчество</div>
                <a-input
                  v-model="$v.form.patronymic.$model"
                  placeholder="Введите отчество"
                  ref="patronymicInput"
                />
              </div>
            </div>
            <div class="row mb-2">
              <div
                class="col-6"
                :class="{ 'has-error': $v.form.phoneNumber.$error }"
              >
                <div class="mb-1">Телефон</div>
                <a-input
                  v-model="$v.form.phoneNumber.$model"
                  placeholder="Введите телефон"
                  ref="phoneInput"
                />
              </div>
              <div
                class="col-6"
                :class="{ 'has-error': $v.form.email.$error }"
              >
                <div class="mb-1">Email</div>
                <a-input
                  v-model="$v.form.email.$model"
                  placeholder="Введите email"
                  ref="emailInput"
                />
              </div>
            </div>
           
            <div class="d-flex justify-content-end">
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
          </form>
        </div>
      </div>
    </div>
  </a-drawer>
</template>

<script>
import { Select } from 'ant-design-vue'
import TimeNotationInput from '~/components/common/TimeNotationInput'
import { required, integer, ipAddress } from 'vuelidate/lib/validators'
import {
  CreateClientEmployeeMut,
  UpdateClientEmployeeMut,
} from '~/graphql/admin/client/employees'
import { AuthPagesQuery } from '~/graphql/admin/client/auth-pages'

const defaultZoneInstance = {
  name: '',
  surname: '',
  patronymic: '',
  phoneNumber: '',
  email: '',
}

const authTypesValidator = (value) => {
  return (
    value.length > 0 &&
    value.filter((el) => el === 'call' || el === 'sms').length <= 1
  )
}

export default {
  data() {
    return {
      form: defaultZoneInstance,
      authPages: [],
    }
  },
  props: {
    clientId: {
      type: Number,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
    },
    editInstance: {
      type: Object,
      required: false,
    },
  },
  apollo: {
    authPages: {
      query: AuthPagesQuery,
      variables() {
        return {
          filter: {
            clientId: this.clientId,
          },
          input: {
            withDeleted: false,
          },
        }
      },
    },
  },
  validations: {
    form: {
      name: { required },
      surname: { required },
      patronymic: { required },
      phoneNumber: { required },
      email: { required },
    },
  },
  methods: {
    onAuthPageSelected(key) {
      if (key === 'default') this.form.authPageId = null
      else this.form.authPageId = Number(key)
    },
    afterVisibleChange(visible) {
      if (visible) {
        if (this.editInstance) {
          this.form = {
            name: this.editInstance.name,
            surname: this.editInstance.surname,
            patronymic: this.editInstance.patronymic,
            phoneNumber: this.editInstance.phoneNumber,
            email: this.editInstance.email,
          }
        }

        setTimeout(() => {
          this.$refs.nameInput.focus()
        }, 150)
      } else {
        setTimeout(() => {
          this.form = defaultZoneInstance
          this.$v.form.$reset()
        }, 150)
      }
    },
    async onFormSubmit() {
      console.log(this.editInstance)
      this.$v.form.$touch()
      if (!this.$v.$invalid) {
        const variables = this.editInstance
          ? {
              id: Number(this.editInstance.id),
              input: this.form,
            }
          : {
              input: { clientId: this.clientId, ...this.form },
            }

        try {
          await this.$apollo.mutate({
            mutation: this.editInstance ? UpdateClientEmployeeMut : CreateClientEmployeeMut,
            variables,
          })

          this.$emit('close')
          this.$message.success(
            `Сотрудник "${this.form.name}" ${
              this.editInstance ? 'обновлен' : 'создан'
            }`
          )
        } catch (error) {
          if (error.graphQLErrors) {
            this.$message.error(error.graphQLErrors[0].message)
          } else {
            this.$message.error('Во время запроса произошла ошибка')
          }
        }
      }
    },
  },
  components: {
    TimeNotationInput,
    'a-select': Select,
    'a-select-option': Select.Option,
  },
}
</script>

<style lang="scss">
.employee-drawer {
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
