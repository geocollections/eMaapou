<template>
  <v-chart
    class="chart"
    v-bind="$attrs"
    autoresize
    group="flog"
    :init-options="initOptions"
    :option="chartOptions"
    v-on="$listeners"
  />
</template>

<script>
import { mapState } from 'vuex'
import { connect, disconnect } from 'echarts/core'
export default {
  name: 'ParamsChart',
  props: {
    chartTitle: {
      type: String,
      required: false,
      default: 'Param',
    },
    yMin: {
      type: Number,
      required: true,
    },
    yMax: {
      type: Number,
      required: true,
    },
    results: {
      type: Array,
      required: true,
    },
    param: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      defaultOptions: {
        title: {
          text: 'Chart title',
          left: 'center',
          textStyle: {
            fontSize: 14,
          },
        },

        grid: {
          show: true,
          top: 50,
          bottom: 140,
          left: '20px',
          containLabel: true,
          width: '200px',
        },

        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: this.$vuetify.theme.currentTheme.warning,
            },
            crossStyle: {
              color: this.$vuetify.theme.currentTheme.warning,
              width: 1,
              type: 'solid',
            },
          },
          formatter(params) {
            return `<span class="mr-2" style="display: inline-block; width: 10px; height: 10px; border-radius: 10px; background-color: ${params.color}"></span><span>${params.seriesName}
              <br />Depth: <b>${params.data[1]}</b></span>
              <br /><span>Value: <b>${params.data[0]}</b></span>`
          },
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        },

        toolbox: {
          top: 20,
          right: 30,
          feature: {
            saveAsImage: {},
          },
        },

        dataZoom: [
          {
            type: 'inside',
            yAxisIndex: 0,
            filterMode: 'filter',
            minValueSpan: 0.1,
          },
        ],
      },
    }
  },
  computed: {
    ...mapState('chart', ['renderer', 'connected']),
    initOptions() {
      return {
        renderer: this.renderer,
      }
    },
    chartOptions() {
      return {
        grid: {
          show: true,
          top: 50,
          bottom: 140,
          left: '20px',
          containLabel: true,
          width: '200px',
        },
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: this.$vuetify.theme.currentTheme.warning,
            },
            crossStyle: {
              color: this.$vuetify.theme.currentTheme.warning,
              width: 1,
              type: 'solid',
            },
          },
          formatter(params) {
            return `
              <span class="mr-2" style="display: inline-block; width: 10px; height: 10px; border-radius: 10px; background-color: ${
                params.color
              }"></span>
              <span>
                ${params.data[4]}<br />
                ${params.seriesName}: <b>${params.data[0]}</b><br />
                Depth: <b>${params.data[2]}</b>
                ${
                  params.data[3]
                    ? `<br />Depth interval: <b>${params.data[3]}</b>`
                    : ''
                }
              </span>
              `
          },
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        },
        toolbox: {
          top: 20,
          right: 30,
          feature: {
            saveAsImage: {},
          },
        },
        dataZoom: [
          {
            type: 'inside',
            yAxisIndex: 0,
            filterMode: 'filter',
            minValueSpan: 0.1,
          },
        ],
        animation: false,
        title: {
          left: 'center',
          textStyle: {
            fontSize: 14,
          },
          text: this.chartTitle,
        },
        xAxis: this.buildXAxis(),
        yAxis: this.buildYAxis(),
        series: this.buildChartSeries(),
      }
    },
  },

  watch: {
    connected: {
      handler(value) {
        if (value) {
          connect('flog')
        } else {
          disconnect('flog')
        }
      },
      immediate: true,
    },
  },

  mounted() {
    connect('flog')
  },
  methods: {
    buildYAxis() {
      return {
        type: 'value',
        boundaryGap: false,
        name: this.$t('common.depth'),
        nameLocation: 'start',
        nameTextStyle: {
          fontWeight: 'bold',
        },
        nameGap: 10,
        splitNumber: 7,
        axisTick: {
          alignWithLabel: true,
        },
        max: this.yMax,
        min: this.yMin,
      }
    },

    buildXAxis() {
      return {
        show: true,
        position: 'top',
        type: 'value',
        // name: param,
        nameLocation: 'center',
        nameTextStyle: {
          fontWeight: 'bold',
          padding: [7, 0, 0, 0],
        },
        min(value) {
          return (value.min - 0.1).toFixed(2) * 1
        },
        max(value) {
          return (value.max + 0.1).toFixed(2) * 1
        },
        splitNumber: 2,
        axisLine: {
          show: true,
          symbol: ['none', 'arrow'],
          symbolSize: [5, 5],
        },
      }
    },

    buildChartSeries() {
      return [
        {
          name: this.param,
          type: 'line',
          smooth: false,
          xAxisIndex: 0,
          data: this.results
            .map((t) => {
              const avgDepth = t.depth_interval
                ? (t.depth + t.depth_interval) / 2
                : t.depth
              return [
                t.value,
                -avgDepth,
                -t.depth,
                -t.depth_interval,
                t.analysis_id,
              ]
            })
            .sort((a, b) => a[1] - b[1]),
          emphasis: {
            focus: 'series',
          },
        },
      ]
    },
  },
}
</script>

<style scoped>
.chart {
  height: 90vh;
  width: 250px;
  min-height: 600px;
  max-height: 2000px;
}
</style>
