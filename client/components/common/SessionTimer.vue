<template>
  <span>{{ timer }}</span>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    date: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      timer: '',
    }
  },
  mounted() {
    const countDownDate = new Date(this.date).getTime()
    this.setTimer(new Date().getTime(), countDownDate)
    const x = setInterval(() => {
      const now = new Date().getTime()
      const distance = this.setTimer(now, countDownDate)

      if (distance < 1) {
        clearInterval(x)
        this.timer = '0d 0h 0m 0s'
        this.$emit('timeout')
      }
    }, 1000)
  },
  methods: {
    setTimer(now, countDownDate) {
      const { days, hours, minutes, seconds, distance } = this.getTime(
        now,
        countDownDate
      )

      this.timer = days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's '
      return distance
    },
    getTime(now, countDownDate) {
      const distance = countDownDate - now

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      return { days, hours, minutes, seconds, distance }
    },
  },
}
</script>
