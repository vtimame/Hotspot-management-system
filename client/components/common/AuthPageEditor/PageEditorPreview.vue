<template>
  <client-only>
    <div class="preview-frame">
      <auth-page is-preview :schema="schema" :stack-host="stackHost" />
    </div>
  </client-only>
</template>

<script>
import AuthPage from 'hotspot2-auth-page/src/components/AuthTemplate.vue'

export default {
  props: {
    schema: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    panes: {
      left: {
        size: 20,
      },
      main: {
        size: 60,
      },
      right: {
        size: 20,
      },
    },
  }),
  computed: {
    stackHost: function () {
      return `${process.env.API_PROTO}://${process.env.API_HOST}/rest/stack/file`
    },
  },
  components: {
    AuthPage,
  },
}
</script>

<style lang="scss">
@import '../../../node_modules/open-color/open-color';

.preview-frame {
  height: 80%;
  width: 450px;
  border: 2px solid $oc-gray-3;
}
</style>
