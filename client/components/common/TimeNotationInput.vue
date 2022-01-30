<template>
  <a-input :value="formattedValue" @input="onInput">
    <a-select
      slot="addonAfter"
      default-value="seconds"
      :style="{ width: '100px' }"
      v-model="notation"
    >
      <a-select-option value="seconds">{{
        optionTitle('Секунд', 'а', 'ы')
      }}</a-select-option>
      <a-select-option value="minutes">{{
        optionTitle('Минут', 'а', 'ы')
      }}</a-select-option>
      <a-select-option value="hours">{{
        optionTitle('Час', '', 'а', 'ов')
      }}</a-select-option>
      <a-select-option value="days">{{
        optionTitle('Д', 'ень', 'ня', 'ней')
      }}</a-select-option>
    </a-select>
  </a-input>
</template>

<script>
import { Select } from 'ant-design-vue'
import declineWord from 'decline-word'

export default {
  props: {
    value: {
      type: [Number, String],
    },
  },
  data: () => ({
    notation: 'seconds',
  }),
  computed: {
    formattedValue: function () {
      const value = Number(this.value)

      if (isNaN(value)) {
        return this.value
      }

      switch (this.notation) {
        case 'seconds':
          return value
        case 'minutes':
          return value / 60
        case 'hours':
          return value / 60 / 60
        case 'days':
          return value / 60 / 60 / 24
        default:
          return value
      }
    },
  },
  methods: {
    optionTitle(mainPart, endingFormOne, endingForTwo, endingForFive = '') {
      if (isNaN(this.formattedValue)) return mainPart
      return declineWord(
        this.formattedValue,
        mainPart,
        endingFormOne,
        endingForTwo,
        endingForFive
      )
    },
    onInput(event) {
      const value = Number(event.target.value)
      let emitValue = 0

      if (isNaN(value)) {
        emitValue = event.target.value
      } else {
        switch (this.notation) {
          case 'seconds':
            emitValue = value
            break
          case 'minutes':
            emitValue = value * 60
            break
          case 'hours':
            emitValue = value * 60 * 60
            break
          case 'days':
            emitValue = value * 60 * 60 * 24
            break
          default:
            emitValue = value
            break
        }
      }

      this.$emit('input', emitValue)
    },
  },
  components: {
    'a-select': Select,
    'a-select-option': Select.Option,
  },
}
</script>
