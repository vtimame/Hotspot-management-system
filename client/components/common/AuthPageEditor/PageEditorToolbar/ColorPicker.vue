<template>
  <div
    class="d-flex align-items-center justify-content-between toolbar-color-picker"
  >
    <div>{{ title }}</div>
    <a-popover trigger="click" placement="rightTop">
      <div slot="content">
        <sketch :value="value" @input="onChange" />
      </div>
      <div class="color-preview" :style="{ backgroundColor: value }"></div>
    </a-popover>
  </div>
</template>

<script>
import { Sketch } from 'vue-color'

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  methods: {
    onChange({ hex }) {
      this.$emit('input', hex)
    },
  },
  components: {
    Sketch,
  },
}
</script>

<style lang="scss">
@import '../../../../node_modules/open-color/open-color';

.toolbar-color-picker {
}

.color-preview {
  width: 24px;
  height: 24px;
  border-radius: 3px;
  border: 2px solid $oc-gray-4;
  cursor: pointer;
}
</style>
