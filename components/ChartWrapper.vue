<template>
  <v-chart
    class="chart"
    v-bind="$attrs"
    autoresize
    :option="computedOptions"
    v-on="$listeners"
  />
</template>

<script>
export default {
  name: 'ChartWrapper',
  props: {
    options: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  data() {
    return {
      defaultOptions: {
        title: {
          text: 'Test title',
          left: 'center',
        },
      },
    }
  },
  computed: {
    computedOptions() {
      console.log({ ...this.defaultOptions, ...this.options })
      return { ...this.defaultOptions, ...this.options }
    },
  },
}
</script>

<style scoped>
.chart {
  /*height: 66.6667vh;*/
  height: 75vh;
}
</style>
