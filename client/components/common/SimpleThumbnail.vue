<template>
  <div
    class="simple-thumbnail"
    :style="{ height, width }"
    @click="$emit('click')"
  >
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    height: {
      type: String,
      default: '150px',
    },
    width: {
      type: String,
      default: '100%',
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~open-color/open-color';

.simple-thumbnail {
  padding: 14px;
  border: 1px solid $oc-gray-3;
  border-radius: 5px;
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    border-color: $oc-blue-5;
  }
}
</style>
