<template>
  <chart-wrapper :options="chartOptions" />
</template>

<script>
import ChartWrapper from '~/components/chart/ChartWrapper'

export default {
  name: 'LasChart',
  components: { ChartWrapper },
  props: {
    fileData: {
      type: Object,
      required: true,
    },
    chartTitle: {
      type: String,
      required: false,
      default: 'Chart title',
    },
  },
  data() {
    return {
      isLoading: false,
    }
  },
  computed: {
    chartOptions() {
      if (this.fileData) {
        return {
          animation: false,

          title: {
            text: this.chartTitle,
          },

          legend: this.buildChartLegend(),

          yAxis: {
            type: 'category',
            boundaryGap: false,
            name: 'DEPTH',
            nameLocation: 'end',
            nameTextStyle: {
              fontWeight: 'bold',
              // fontSize: 14,
              padding: [0, 70, 0, 0],
            },
            // nameGap: 35,
            splitNumber: 7,
            axisTick: {
              alignWithLabel: true,
            },
            // min(value) {
            //   return (value.min - 0.1).toFixed(2) * 1
            // },
            // max(value) {
            //   return (value.max + 0.1).toFixed(2) * 1
            // },
            data: this.fileData?.data?.DEPTH,
          },

          xAxis: this.buildYAxis(),

          series: this.buildChartSeries(),
        }
      } else return {}
    },
  },
  methods: {
    buildChartLegend() {
      return {
        data: Object.keys(this.fileData?.metadata?.Curves).slice(1),
      }
    },

    buildYAxis() {
      // First item in data is always DEPTH
      return Object.entries(this.fileData?.data).reduce(
        (prev, curr, currIdx) => {
          if (curr[0] !== 'DEPTH') {
            const yAxis = {
              // Todo: Show should be toggleable using legend
              show: true, // Default is true
              position: 'bottom',
              // Calculates axisLabel offset, adds +25 after every axis
              offset: currIdx - 1 > 0 ? (currIdx - 1) * 25 : 0,
              type: 'value',
              name: curr[0],
              nameLocation: 'end',
              nameTextStyle: {
                fontWeight: 'bold',
              },
              // min(value) {
              //   return (value.min - 0.1).toFixed(2) * 1
              // },
              // max(value) {
              //   return (value.max + 0.1).toFixed(2) * 1
              // },
              splitNumber: 2,
              axisLine: {
                show: true,
                symbol: ['none', 'arrow'],
                symbolSize: [5, 5],
              },
              // Todo: Get correct Unit from API (currently metadata omits it)
              // axisLabel: {
              //   formatter(value) {
              //     return `${value} %`
              //   },
              // },
            }
            prev.push(yAxis)
          }
          return prev
        },
        []
      )
    },

    buildChartSeries() {
      // First item in data is always DEPTH
      return Object.entries(this.fileData?.data).reduce(
        (prev, curr, currIdx) => {
          if (curr[0] !== 'DEPTH') {
            const series = {
              name: curr[0],
              type: 'line',
              xAxisIndex: currIdx - 1,
              data: curr[1],
              emphasis: {
                focus: 'series',
              },
            }
            prev.push(series)
          }
          return prev
        },
        []
      )
    },
  },
}
</script>
