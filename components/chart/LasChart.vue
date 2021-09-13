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

          xAxis: {
            type: 'category',
            boundaryGap: false,
            name: 'Depth',
            nameLocation: 'center',
            nameTextStyle: {
              fontWeight: 'bold',
              fontSize: 16,
            },
            nameGap: 25,
            splitNumber: 7,
            axisTick: {
              alignWithLabel: true,
            },
            min(value) {
              return (value.min - 0.1).toFixed(2) * 1
            },
            max(value) {
              return (value.max + 0.1).toFixed(2) * 1
            },
            data: this.fileData?.data?.DEPTH,
          },

          yAxis: this.buildYAxis(),

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
              type: 'value',
              name: curr[0],
              nameLocation: 'center',
              nameTextStyle: {
                fontWeight: 'bold',
                fontSize: 16,
              },
              axisLine: {
                show: true,
              },
              // Calculates axisLabel offset, adds +70 after every axis
              offset: currIdx - 2 > 0 ? currIdx * 80 : 0,
              min(value) {
                return (value.min - 0.1).toFixed(2) * 1
              },
              max(value) {
                return (value.max + 0.1).toFixed(2) * 1
              },
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
              yAxisIndex: currIdx - 1,
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
