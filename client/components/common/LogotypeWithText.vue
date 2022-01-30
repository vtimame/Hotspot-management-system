<template>
  <div class="d-flex align-items-center">
    <logotype :size="logotypeSize" :color="logotypeColor" />
    <div :style="{ marginLeft: '0.5rem' }">
      <div class="title">{{ appTitle }}</div>
      <div class="sub-title">Идеальный десерт без выпечки</div>
    </div>
  </div>
</template>

<script>
import Logotype from '~/components/common/Logotype'
export default {
  name: 'logotype-with-text',
  components: { Logotype },
  props: {
    logotypeSize: {
      type: [String, Number],
      default: '35',
    },
    logotypeColor: {
      type: String,
      default: '#cc0000',
    },
  },
  computed: {
    appTitle: function () {
      return process.env.APP_NAME
    },
  },
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 1.4rem;
  font-weight: bold;
  line-height: 1.4rem;
}
</style>
