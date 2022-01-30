<template>
  <a-drawer
    class="zone-drawer"
    :visible="visible"
    :closable="false"
    :mask-closable="false"
    :body-style="{ padding: 0 }"
    placement="bottom"
    height="fill-content"
    :after-visible-change="afterVisibleChange"
  >
    <div class="zone-drawer__content container py-3">
      <div class="row">
        <div class="col-8 offset-2">
          <header class="zone-drawer__header">
            {{ editInstance ? 'Изменить' : 'Добавить' }} зону
          </header>
          <form class="zone-drawer__form" @submit.prevent="onFormSubmit">
            <div class="row mb-2">
              <div class="col-6" :class="{ 'has-error': $v.form.name.$error }">
                <div class="mb-1">Название зоны</div>
                <a-input
                  v-model="$v.form.name.$model"
                  placeholder="Введите название зоны"
                  ref="nameInput"
                />
              </div>
              <div
                class="col-6"
                :class="{ 'has-error': $v.form.interfaceName.$error }"
              >
                <div class="mb-1">Интерфейс</div>
                <a-input
                  v-model="$v.form.interfaceName.$model"
                  placeholder="Введите интерфейс"
                />
              </div>
            </div>
            <div class="row mb-2">
              <div
                class="col-6"
                :class="{ 'has-error': $v.form.authTypes.$error }"
              >
                <div class="mb-1">Типы авторизации</div>
                <a-select
                  v-model="$v.form.authTypes.$model"
                  placeholder="Выберите типы авторизации"
                  mode="multiple"
                >
                  <a-select-option key="call">Звонок</a-select-option>
                  <a-select-option key="sms">СМС</a-select-option>
                  <a-select-option key="voucher">Ваучеры</a-select-option>
                </a-select>
              </div>
              <div
                class="col-6"
                :class="{ 'has-error': $v.form.authPageId.$error }"
              >
                <div class="mb-1">Страница авторизации</div>
                <a-select
                  :value="form.authPageId ? String(form.authPageId) : 'default'"
                  @change="onAuthPageSelected"
                  placeholder="Выберите страницу авторизации"
                >
                  <a-select-option key="default">Без страницы</a-select-option>
                  <a-select-option v-for="page in authPages" :key="page.id">{{
                    page.title
                  }}</a-select-option>
                </a-select>
              </div>
            </div>
            <div class="row mb-3">
              <div
                class="col-4"
                :class="{ 'has-error': $v.form.routerIp.$error }"
              >
                <div class="mb-1">IP роутера</div>
                <a-input
                  v-model="$v.form.routerIp.$model"
                  placeholder="Введите ip роутера"
                />
              </div>
              <div
                class="col-4"
                :class="{ 'has-error': $v.form.routerLogin.$error }"
              >
                <div class="mb-1">Логин роутера</div>
                <a-input
                  v-model="$v.form.routerLogin.$model"
                  placeholder="Введите логин роутера"
                />
              </div>
              <div
                class="col-4"
                :class="{ 'has-error': $v.form.routerPassword.$error }"
              >
                <div class="mb-1">Пароль роутера</div>
                <a-input
                  v-model="$v.form.routerPassword.$model"
                  placeholder="Введите пароль роутера"
                />
              </div>
            </div>
            <div class="row mb-3">
              <div
                class="col-4"
                :class="{ 'has-error': $v.form.authLifetime.$error }"
              >
                <div class="mb-1">Длительность авторизации</div>
                <time-notation-input v-model="$v.form.authLifetime.$model" />
              </div>
              <div
                class="col-4"
                :class="{ 'has-error': $v.form.sessionLifetime.$error }"
              >
                <div class="mb-1">Длительность сесси</div>
                <time-notation-input v-model="$v.form.sessionLifetime.$model" />
              </div>
              <div
                class="col-4"
                :class="{ 'has-error': $v.form.sessionTimeout.$error }"
              >
                <div class="mb-1">Таймаут</div>
                <time-notation-input v-model="$v.form.sessionTimeout.$model" />
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
import { CreateZoneMut, UpdateZoneMut } from '~/graphql/admin/client/zones'
import { AuthPagesQuery } from '~/graphql/admin/client/auth-pages'

const defaultZoneInstance = {
  name: '',
  interfaceName: '',
  routerIp: '',
  routerLogin: '',
  routerPassword: '',
  authTypes: [],
  authPageId: null,
  authLifetime: 0,
  sessionLifetime: 0,
  sessionTimeout: 0,
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
      interfaceName: { required },
      routerIp: { required, ipAddress },
      routerLogin: { required },
      routerPassword: { required },
      authTypes: { authTypesValidator },
      authPageId: {},
      authLifetime: { required, integer },
      sessionLifetime: { required, integer },
      sessionTimeout: { required, integer },
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
            authPageId: this.editInstance.authPageId,
            interfaceName: this.editInstance.interfaceName,
            routerIp: this.editInstance.routerIp,
            routerLogin: this.editInstance.routerLogin,
            routerPassword: this.editInstance.routerPassword,
            authTypes: this.editInstance.authTypes,
            authLifetime: this.editInstance.authLifetime,
            sessionLifetime: this.editInstance.sessionLifetime,
            sessionTimeout: this.editInstance.sessionTimeout,
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
            mutation: this.editInstance ? UpdateZoneMut : CreateZoneMut,
            variables,
          })

          this.$emit('close')
          this.$message.success(
            `Зона "${this.form.name}" ${
              this.editInstance ? 'обновлена' : 'создана'
            }`
          )
        } catch (error) {
          if (error.graphQLErrors) {
            this.$message.error(error.graphQLErrors[0].message)
          } else {
            this.$message.error('Во время запроза произошла ошибка')
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
.zone-drawer {
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
