<template>
  <div>
    <canvas ref="chart" :style="{ width: '100%', height: 'auto' }"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'
import momentMixin from '~/mixins/moment.mixin'

export default {
  mixins: [momentMixin],
  props: {
    stats: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      datasets: [
        {
          label: 'Подклчений',
          data: this.stats,
          borderColor: '#cc0000',
          borderWidth: 1,
          radius: 0,
        },
      ],
      options: {
        parsing: {
          xAxisKey: 'key',
          yAxisKey: 'count',
        },
        interaction: {
          intersect: false,
        },
        plugins: {
          legend: false,
        },
        scales: {
          x: {
            display: false,
          },
        },
      },
    }
  },
  mounted() {
    if (window !== undefined) {
      new Chart(this.$refs.chart.getContext('2d'), {
        type: 'line',
        data: {
          datasets: this.datasets,
        },
        options: this.options,
      })
    }
  },
}
</script>
