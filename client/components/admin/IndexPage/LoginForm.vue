<template>
  <form @submit.prevent="onSubmit" class="login-form">
    <div class="mb-1">
      <div>
        <a-input
          v-model="form.login"
          class="login-input"
          placeholder="Ваш почтовый адрес, алиас или номер телефона"
          @focus="inputs.login.focus = true"
          @blur="inputs.login.focus = false"
          @mouseover="inputs.login.hover = true"
          @mouseout="inputs.login.hover = false"
          :disabled="loginIsChecked"
          ref="loginInput"
        />
      </div>
      <div
        class="input-space"
        :class="{ 'input-space--is-active': spaceIsActive }"
      ></div>
      <div>
        <a-input
          v-model="form.password"
          class="password-input"
          placeholder="Пин-код"
          @focus="inputs.password.focus = true"
          @blur="inputs.password.focus = false"
          @mouseover="inputs.password.hover = true"
          @mouseout="inputs.password.hover = false"
          :disabled="!loginIsChecked"
          ref="passwordInput"
        />
      </div>
    </div>
    <div>
      <a-button
        block
        type="primary"
        :disabled="buttonIsDisabled"
        html-type="submit"
        >Продолжить</a-button
      >
    </div>
  </form>
</template>

<script>
import { LoginMut } from '~/graphql/common.graphql'

export default {
  name: 'login-form',
  mounted() {
    setTimeout(() => {
      const loginInput = this.$refs.loginInput
      loginInput.focus()
    }, 150)
  },
  data() {
    return {
      inputs: {
        login: {
          focus: false,
          hover: false,
        },
        password: {
          focus: false,
          hover: false,
        },
      },
      form: {
        login: '',
        password: '',
      },
      loginIsChecked: false,
    }
  },
  computed: {
    buttonIsDisabled: function () {
      if (this.loginIsChecked) {
        return (
          this.form.login.toString().trim().length === 0 ||
          this.form.password.toString().trim().length === 0
        )
      } else {
        return this.form.login.toString().trim().length === 0
      }
    },
    spaceIsActive: function () {
      const { login, password } = this.inputs
      if (login.focus || login.hover || password.focus || password.hover) {
        return Boolean(1)
      }

      if (
        (!login.focus && login.hover) ||
        (!password.focus && password.hover)
      ) {
        return Boolean(1)
      }

      return Boolean(0)
    },
  },
  methods: {
    async onSubmit() {
      !this.loginIsChecked ? await this.checkLogin() : await this.login()
    },
    async checkLogin() {
      const variables = {
        input: {
          login: this.form.login,
        },
      }

      try {
        await this.sendMutation(variables)
        this.$message.success(
          `Добрый день! На ваш номер телефона был выслан пин-код`
        )

        this.loginIsChecked = true
        setTimeout(() => {
          const passwordInput = this.$refs.passwordInput
          passwordInput.focus()
        }, 150)
      } catch (error) {
        this.$message.error('Пользователь не найден')
      }
    },
    async login() {
      const variables = {
        input: this.form,
      }

      try {
        const { jwt, authEntity } = await this.sendMutation(variables)
        if (typeof jwt === 'string') {
          await this.$apolloHelpers.onLogin(jwt)
          if (authEntity.__typename === 'User') {
            await this.$router.push({ name: 'admin-dashboard' })
          } else if (authEntity.__typename === 'Client') {
            await this.$router.push({ name: 'client' })
          }
        } else {
          this.$message.error('Во время запроса произошла ошибка')
        }
      } catch (error) {
        this.$message.error('Неверный пин-код')
      }
    },
    async sendMutation(variables) {
      const {
        data: { login },
      } = await this.$apollo.mutate({
        mutation: LoginMut,
        variables,
      })

      return login
    },
  },
}
</script>

<style lang="scss">
.login-form {
  .login-input,
  .password-input {
    &:focus {
      box-shadow: none;
    }
  }

  .login-input {
    border-bottom: none;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .password-input {
    border-top: none;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .input-space {
    border-top: 1px solid #d9d9d9;
    transition: all 0.3s;

    &--is-active {
      border-color: #40a9ff;
    }
  }
}
</style>
