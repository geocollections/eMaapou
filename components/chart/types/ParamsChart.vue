<template>
  <div>
    <params-chart-wrapper
      v-for="(item, index) in params"
      :key="index"
      :options="optionsUsingParameter(item)"
    />
  </div>
</template>

<script>
import ParamsChartWrapper from '~/components/chart/wrappers/ParamsChartWrapper'
export default {
  name: 'ParamsChart',
  components: { ParamsChartWrapper },
  props: {
    chartTitle: {
      type: String,
      required: false,
      default: 'Param',
    },
    minDepth: {
      type: Number,
      required: true,
      default: 0,
    },
    maxDepth: {
      type: Number,
      required: true,
      default: 0,
    },
    results: {
      type: Array,
      required: true,
      default: () => {},
    },
    params: {
      type: Array,
      required: true,
      default: () => {},
    },
  },
  methods: {
    optionsUsingParameter(param) {
      return {
        animation: false,

        title: {
          text: param,
        },

        yAxis: this.buildYAxis(),

        xAxis: this.buildXAxis(param),

        series: this.buildChartSeries(param),
      }
    },

    buildYAxis() {
      return {
        type: 'value',
        boundaryGap: false,
        name: 'Depth',
        nameLocation: 'end',
        nameTextStyle: {
          fontWeight: 'bold',
        },
        nameGap: 10,
        splitNumber: 7,
        axisTick: {
          alignWithLabel: true,
        },
        max:
          this.maxDepth > 0 && this.maxDepth > this.minDepth
            ? this.minDepth * -1
            : this.maxDepth,
        min:
          this.minDepth > 0 && this.minDepth < this.maxDepth
            ? this.maxDepth * -1
            : this.minDepth,
      }
    },

    buildXAxis(param) {
      return {
        show: true,
        position: 'bottom',
        type: 'value',
        name: param.substring(param.indexOf('[') + 1, param.indexOf(']')),
        nameLocation: 'center',
        nameTextStyle: {
          fontWeight: 'bold',
          padding: [7, 0, 0, 0],
        },
        min(value) {
          return (value.min - 0.1).toFixed(2) * 1
          // return Math.floor(((value.min - 0.1).toFixed(2) * 1) / 10) * 10
        },
        max(value) {
          return (value.max + 0.1).toFixed(2) * 1
          // return Math.ceil(((value.max + 0.1).toFixed(2) * 1) / 10) * 10
        },
        splitNumber: 2,
        axisLine: {
          show: true,
          symbol: ['none', 'arrow'],
          symbolSize: [5, 5],
        },
      }
    },

    buildChartSeries(param) {
      return [
        {
          name: param,
          type: 'line',
          smooth: false,
          xAxisIndex: 0,
          data: this.results
            .filter((result) => result.parameter === param)
            .map((t) => [t.value, t.depth * -1]),
          emphasis: {
            focus: 'series',
          },
        },
      ]
    },
  },
}
</script>
