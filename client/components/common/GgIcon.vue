<template>
  <svg
    :width="`${size.toString().trim()}`"
    :height="`${size.toString().trim()}`"
    :fill="color"
  >
    <use :href="`${icons}#${type}`" />
  </svg>
</template>

<script>
import icons from 'css.gg/icons/all.svg'

export default {
  data: () => ({
    icons,
  }),
  mounted() {
    console.log(this.color)
  },
  props: {
    type: {
      type: String,
      required: true,
    },
    size: {
      type: [String, Number],
      default: 24,
    },
    color: {
      type: String,
      default: 'none',
    },
    stroke: {
      type: String,
      default: 'currentColor',
    },
    strokeWidth: {
      type: Number,
      default: 2,
    },
    strokeLinecap: {
      type: String,
      default: 'round',
    },
    strokeLinejoin: {
      type: String,
      default: 'round',
    },
  },
}
</script>
