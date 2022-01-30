<template>
  <div>
    <logotype-with-text class="mb-3" logotype-size="18" />
    <login-form />
  </div>
</template>

<script>
import LoginForm from '~/components/admin/IndexPage/LoginForm.vue'
import LogotypeWithText from '~/components/common/LogotypeWithText.vue'
export default {
  layout: 'auth',
  middleware: ['guest'],
  components: { LogotypeWithText, LoginForm },
}
</script>

<style lang="scss" scoped></style>
