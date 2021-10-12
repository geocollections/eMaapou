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
      default: 'Samples',
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
        axisLabel: {
          fontWeight: 'bold',
          padding: [13, 0, 0, 0],
        },
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
          show: true,
          alignWithLabel: true,
        },
        axisLine: {
          show: true,
          lineStyle: {
            // width: 15,
          },
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
      return [
        {
          type: 'scatter',
          color: 'black',
          tooltip: {
            position: 'bottom',
            formatter(params) {
              return `<span class="mr-2" style="display: inline-block; width: 10px; height: 10px; border-radius: 10px; background-color: ${params.color}"></span><span>${params.data.name}
                    <br />Depth: <b>${params.data.sampleDepth}</b></span>
                    <br /><span>Depth interval: <b>${params.data.sampleDepthInterval}</b></span>`
            },
          },
          data: this.results.map((item) => {
            const depth =
              item?.depth && item?.depth_interval
                ? ((item.depth + item.depth_interval) / 2).toFixed(2)
                : item?.depth
                ? item.depth
                : item.depth_interval
            return {
              sampleDepth: -item.depth,
              sampleDepthInterval: -item.depth_interval,
              sampleId: item.id,
              name: item.number || item.id,
              value: [0, -depth],
              symbol: 'rect',
              symbolSize: 3,
              label: {
                show: true,
                position: 'right',
                // distance: 15,
                formatter(params) {
                  return `${params.data.name}`
                },
              },
            }
          }),
        },
      ]
    },
  },
}
</script>
