<template>
  <svg
    :width="`${size.toString().trim()}`"
    :height="`${size.toString().trim()}`"
    :fill="color"
    :stroke="stroke"
    :stroke-width="strokeWidth"
    :stroke-linecap="strokeLinecap"
    :stroke-linejoin="strokeLinejoin"
  >
    <use :href="`${icons}#${type}`" />
  </svg>
</template>

<script>
import icons from 'feather-icons/dist/feather-sprite.svg'

export default {
  data: () => ({
    icons,
  }),
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
