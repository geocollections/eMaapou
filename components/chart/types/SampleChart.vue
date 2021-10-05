<template>
  <sample-chart-wrapper :options="chartOptions" />
</template>

<script>
import SampleChartWrapper from '~/components/chart/wrappers/SampleChartWrapper'

export default {
  name: 'SampleChart',
  components: { SampleChartWrapper },
  props: {
    chartTitle: {
      type: String,
      required: false,
      default: 'Chart title',
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
  },
  computed: {
    chartOptions() {
      if (this.results?.length > 0) {
        return {
          animation: false,

          title: {
            text: this.chartTitle,
          },

          xAxis: this.buildXAxis(),

          yAxis: this.buildYAxis(),

          series: this.buildChartSeries(),
        }
      } else return {}
    },
  },
  methods: {
    buildXAxis() {
      return {
        type: 'category',
        data: ['Sample'],
      }
    },

    buildYAxis() {
      return {
        show: true,
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

    buildChartSeries() {
      console.log(this.results)
      return this.results.map((item) => {
        return {
          type: 'line',
          name: item.number || item.id,
          color: 'black',
          data:
            item?.depth && item?.depth_interval
              ? [item.depth, item.depth_interval]
              : item?.depth
              ? [item.depth]
              : [item.depth_interval],
          lineStyle: {
            width: 30,
          },
          symbol: 'rect',
          symbolSize: 0,
          showAllSymbol: false,
          label: {
            show: true,
            position: 'right',
            distance: 25,
            formatter(params) {
              return `${params.seriesName}`
            },
          },
        }
      })
    },
  },
}
</script>
