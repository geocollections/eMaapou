<template>
  <!-- <sample-chart-wrapper :options="chartOptions" /> -->
  <div>
    <v-chart
      class="chart"
      v-bind="$attrs"
      autoresize
      group="flog"
      :init-options="initOptions"
      :option="chartOptions"
      v-on="$listeners"
      @click="handleClick"
    />
  </div>
</template>

<script>
import { graphic } from 'echarts'
import { mapState } from 'vuex'
import { connect, disconnect } from 'echarts/core'
export default {
  name: 'SampleChart',
  props: {
    chartTitle: {
      type: String,
      required: false,
      default: 'Samples',
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
      default: () => {},
    },
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
        title: {
          text: this.chartTitle,
          left: 'center',
          textStyle: {
            fontSize: 14,
          },
        },
        grid: {
          // top: 50,
          // bottom: 140,
          left: '30%',
          // containLabel: true,
          width: 200,
        },
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        },
        toolbox: {
          // top: 20,
          right: 30,
          feature: {
            saveAsImage: {},
          },
        },
        dataZoom: [
          {
            type: 'inside',
            yAxisIndex: 0,
            filterMode: 'weakFilter',
            minValueSpan: 0.1,
          },
        ],
        animation: false,
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
    buildXAxis() {
      return {
        type: 'category',
        data: [' '],
        position: 'top',
        axisLabel: {
          fontWeight: 'bold',
          padding: [13, 0, 0, 0],
        },
        axisLine: {
          show: false,
        },
      }
    },

    buildYAxis() {
      return {
        show: true,
        type: 'value',
        name: this.$t('common.depth'),
        nameLocation: 'start',
        nameTextStyle: {
          fontWeight: 'bold',
        },
        nameGap: 10,
        splitNumber: 7,
        axisTick: {
          show: true,
          interval: 0.1,
        },
        axisLabel: {
          showMinLabel: false,
          showMaxLabel: false,
        },
        axisLine: {
          show: true,
          lineStyle: {},
        },
        splitLine: {
          show: false,
        },
        max: this.yMax,
        min: this.yMin,
      }
    },

    buildChartSeries() {
      return [
        {
          type: 'custom',
          tooltip: {
            position: 'bottom',
            formatter(params) {
              return `
              <span class="mr-2" style="display: inline-block; width: 10px; height: 10px; border-radius: 10px; background-color: ${
                params.color
              }"></span>
              <span>
                ${params.data[4]}<br />
                Depth: <b>${params.data[1]}</b><br />
                ${
                  params.data[2]
                    ? `Depth interval: <b>${params.data[2]}</b>`
                    : ''
                }
              </span>
              `
            },
          },
          labelLayout: {
            hideOverlap: true,
          },
          label: {
            show: true,
            position: 'right',
            color: 'black',
            fontSize: 12,
            triggerEvent: true,
            formatter(params) {
              return params.data[4]
            },
          },
          renderItem(params, api) {
            const categoryIndex = api.value(0)

            const depthInterval = api.value(2)
              ? api.value(2)
              : api.value(1) - 0.1
            const start = api.coord([categoryIndex, api.value(1)])
            const end = api.coord([categoryIndex, depthInterval])

            const categoryWidth = api.size([0, 1])[0]
            const height =
              api.value(2) || end[1] - start[1] < 10 ? end[1] - start[1] : 10
            const x = start[0] - categoryWidth * 0.5
            const y = api.value(2) ? start[1] : start[1] - height / 2
            const rectShape = graphic.clipRectByRect(
              {
                x,
                y,
                width: 10,
                height,
              },
              {
                x: params.coordSys.x,
                y: params.coordSys.y,
                width: params.coordSys.width,
                height: params.coordSys.height,
              }
            )
            return (
              rectShape && {
                type: 'rect',
                transition: ['shape'],
                shape: rectShape,
                style: { ...api.style(), fill: '#000000' },
                emphasis: {
                  style: api.style(),
                },
              }
            )
          },
          encode: {
            x: [0],
            y: [1, 2],
          },
          data: this.results.map((item) => {
            return [
              0,
              -item.depth,
              -item.depth_interval,
              item.id,
              item.sample_number || item.sample_id,
            ]
          }),
        },
      ]
    },
    // Click event opens sample detail view
    handleClick(event) {
      const sampleId = event.data[3]
      if (sampleId) this.$openNuxtWindow('sample-id', { id: sampleId })
    },
  },
}
</script>

<style scoped>
.chart {
  height: 90vh;
  width: 200px;
  min-height: 600px;
  max-height: 2000px;
}
</style>
