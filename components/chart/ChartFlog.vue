<template>
  <client-only>
    <div class="pa-2">
      <div class="mb-2">
        <options-method-tree-view
          :methods="methods"
          :initial-selection="selectedParameters"
          @input="handleMethodsUpdate"
        />
      </div>
      <div class="mb-2 d-flex flex-row flex-wrap">
        <renderer-switch
          class="mr-2"
          :renderer="renderer"
          @update="renderer = $event"
        />
      </div>
      <div class="overflow-x-auto">
        <v-chart
          class="chart"
          :style="{ width: chartWidth }"
          v-bind="$attrs"
          autoresize
          group="flog"
          :init-options="initOptions"
          :option="options"
          v-on="$listeners"
          @click="handleClick"
        />
      </div>
    </div>
  </client-only>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import { graphic } from 'echarts'
import RendererSwitch from '~/components/chart/options/RendererSwitch'
import OptionsMethodTreeView from '~/components/chart/options/OptionsMethodTreeView.vue'
import range from '~/utils/range'
export default {
  name: 'ChartFlog',
  components: {
    RendererSwitch,
    OptionsMethodTreeView,
  },
  props: {
    analyses: {
      type: Array,
      default: () => [],
    },
    samples: {
      type: Array,
      default: () => [],
    },
    taxa: {
      type: Array,
      default: () => [],
    },
    minDepth: {
      type: Number,
      required: true,
    },
    maxDepth: {
      type: Number,
      required: true,
    },
    methods: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedParameters: [],
      parameterChartWidth: 200,
      parameterChartPadding: 50,
      parameterModulePadding: 40,
      sampleChartWidth: 100,
      sampleChartPaddingLeft: 100,
    }
  },
  computed: {
    ...mapFields('chart', ['renderer', 'connected']),
    chartWidth() {
      const parameterModuleWidth =
        this.selectedParameters.length *
          (this.parameterChartWidth + this.parameterChartPadding) +
        this.parameterModulePadding
      return `${
        this.sampleChartWidth +
        this.sampleChartPaddingLeft +
        parameterModuleWidth
      }px`
    },
    totalSubcharts() {
      return 1 + this.selectedParameters.length
    },
    initOptions() {
      return {
        renderer: this.renderer,
      }
    },
    options() {
      return {
        animation: false,
        grid: [
          {
            // top: 50,
            // bottom: 140,
            left: this.sampleChartPaddingLeft,
            containLabel: false,
            // containLabel: true,
            width: this.sampleChartWidth,
          },
          ...this.parameterGrid(this.selectedParameters),
          // { show: false, containLabel: false, left: 0, right: 0 },
        ],
        tooltip: {
          trigger: 'item',
        },
        dataZoom: [
          {
            type: 'inside',
            yAxisIndex: range(1 + this.selectedParameters.length + 1),
            filterMode: 'weakFilter',
            minValueSpan: 0.1,
          },
        ],
        toolbox: {
          // right: 30,
          orient: 'vertical',
          left: 'left',
          feature: {
            dataZoom: {
              yAxisIndex: 'none',
              xAxisIndex: 'all',
            },
            saveAsImage: {},
          },
        },
        axisPointer: {
          link: [{ yAxisIndex: 'all' }],
          triggerTooltip: false,
          label: {
            fontSize: 10,
            backgroundColor: this.$vuetify.theme.currentTheme.warning,
          },
          lineStyle: {
            color: this.$vuetify.theme.currentTheme.warning,
            width: 1,
          },
        },
        xAxis: [
          {
            type: 'category',
            data: ['Samples'],
            position: 'top',
            axisLabel: {
              fontWeight: 'bold',
              margin: 30,
            },
            nameGap: 30,
            gridIndex: 0,
            axisLine: {
              show: false,
            },
          },
          ...this.parameterXAxes(this.selectedParameters),
          // {
          //   show: false,
          //   min(value) {
          //     return (value.min - 0.1).toFixed(2) * 1
          //   },
          //   max(value) {
          //     return (value.max + 0.1).toFixed(2) * 1
          //   },
          //   gridIndex: this.selectedParameters.length + 1,
          // },
        ],
        yAxis: [
          {
            show: true,
            type: 'value',
            name: this.$t('common.depth'),
            nameLocation: 'center',
            nameGap: 40,
            nameTextStyle: {
              fontWeight: 'bold',
            },
            splitNumber: 7,
            axisTick: {
              show: true,
              interval: 0.1,
            },
            axisLabel: {
              showMinLabel: false,
              showMaxLabel: false,
            },
            minorTick: {
              show: true,
              splitNumber: 10,
            },
            axisLine: {
              show: true,
              lineStyle: {},
            },
            splitLine: {
              show: false,
            },
            axisPointer: {
              show: true,
              // label: {
              //   backgroundColor: this.$vuetify.theme.currentTheme.warning,
              // },
              // lineStyle: {
              //   color: this.$vuetify.theme.currentTheme.warning,
              //   width: 1,
              // },
            },
            gridIndex: 0,
            max: this.maxDepth,
            min: this.minDepth,
          },
          ...this.parameterYAxes(this.selectedParameters),
          // {
          //   show: false,
          //   axisPointer: {
          //     show: true,
          //     label: {
          //       backgroundColor: this.$vuetify.theme.currentTheme.warning,
          //     },
          //     lineStyle: {
          //       color: this.$vuetify.theme.currentTheme.warning,
          //       width: 1,
          //     },
          //   },
          //   gridIndex: this.selectedParameters.length + 1,
          //   max: this.maxDepth,
          //   min: this.minDepth,
          // },
        ],
        series: [
          {
            type: 'custom',
            name: 'samples',
            xAxisIndex: 0,
            yAxisIndex: 0,
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
            data: this.samples.map((item) => {
              return [
                0,
                -item.depth,
                -item.depth_interval,
                item.id,
                item.sample_number || item.sample_id,
              ]
            }),
          },
          ...this.parameterSeries(this.selectedParameters),
        ],
      }
    },
  },
  created() {
    // Set initial selected parameters
    if (this.methods.length > 0) {
      this.selectedParameters = this.methods[0].children.slice(
        0,
        this.methods[0].children.length > 3
          ? 3
          : this.methods[0].children.length
      )
    }
  },
  methods: {
    handleClick(event) {
      if (event.seriesName === 'samples') {
        const sampleId = event.data[3]
        if (sampleId) this.$openNuxtWindow('sample-id', { id: sampleId })
      }
    },
    handleMethodsUpdate(event) {
      this.selectedParameters = event
    },
    parameterGrid(selectedParameters, startPosition = 1) {
      return selectedParameters.map((param, i) => {
        return {
          show: true,
          containLabel: false,
          left:
            this.sampleChartWidth +
            this.sampleChartPaddingLeft +
            i * (this.parameterChartWidth + this.parameterChartPadding) +
            this.parameterModulePadding,
          width: this.parameterChartWidth,
          borderWidth: 0,
          tooltip: {
            trigger: 'item',
            // axisPointer: {
            //   type: 'line',
            //   axis: 'x',
            //   label: {
            //     backgroundColor: this.$vuetify.theme.currentTheme.warning,
            //   },
            //   crossStyle: {
            //     color: this.$vuetify.theme.currentTheme.warning,
            //     width: 1,
            //     type: 'solid',
            //   },
            // },
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          },
        }
      })
    },
    parameterXAxes(selectedParameters, startPosition = 1) {
      return selectedParameters.map((selectedParam, i) => {
        return {
          show: true,
          position: 'top',
          type: 'value',
          name: selectedParam.name,
          nameLocation: 'center',
          nameTextStyle: {
            fontWeight: 'bold',
            // padding: [7, 0, 0, 0],
          },
          nameGap: 30,
          min(value) {
            return (value.min - 0.1).toFixed(2) * 1
          },
          max(value) {
            return (value.max + 0.1).toFixed(2) * 1
          },
          gridIndex: startPosition + i,
          splitNumber: 2,
          axisPointer: {
            show: true,
          },
          axisLine: {
            show: true,
            symbol: ['none', 'arrow'],
            symbolSize: [5, 5],
          },
        }
      })
    },
    parameterYAxes(selectedParameters, startPosition = 1) {
      return selectedParameters.map((selectedParam, i) => {
        return {
          type: 'value',
          boundaryGap: false,
          // name: this.$t('common.depth'),
          // nameLocation: 'start',
          // nameTextStyle: {
          //   fontWeight: 'bold',
          // },
          nameGap: 10,
          splitNumber: 7,
          axisTick: {
            alignWithLabel: true,
          },
          minorTick: {
            show: true,
            splitNumber: 10,
          },
          axisLabel: {
            show: false,
          },
          gridIndex: startPosition + i,
          splitLine: {
            show: false,
          },
          axisPointer: {
            show: true,
            // label: {
            //   backgroundColor: this.$vuetify.theme.currentTheme.warning,
            // },
            // lineStyle: {
            //   color: this.$vuetify.theme.currentTheme.warning,
            //   width: 1,
            // },
          },
          max: this.maxDepth,
          min: this.minDepth,
        }
      })
    },
    parameterSeries(selectedParameters, startPosition = 1) {
      return selectedParameters.map((selectedParam, i) => {
        return {
          name: selectedParam.name,
          type: 'line',
          smooth: false,
          xAxisIndex: startPosition + i,
          yAxisIndex: startPosition + i,
          itemStyle: {
            color: this.$vuetify.theme.currentTheme.accent,
          },
          lineStyle: {
            width: 1,
          },
          tooltip: {
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
          },
          data: this.analyses
            .filter((result) => result.parameter === selectedParam.name)
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
        }
      })
    },
  },
}
</script>

<style>
.chart {
  height: 90vh;
  /* width: 1000px; */
  /* min-height: 600px; */
  /* max-height: 2000px; */
}
</style>
