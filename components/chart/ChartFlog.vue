<template>
  <client-only>
    <div class="">
      <v-toolbar flat dense>
        <options-method-tree-view
          :methods="methods"
          :initial-selection="selectedParameters"
          @input="handleMethodsUpdate"
        />
        <renderer-switch
          class="mx-2"
          :renderer="renderer"
          @update="renderer = $event"
        />
        <v-text-field
          v-model="scale"
          class="ml-2 shrink text-body-2"
          type="number"
          single-line
          height="24"
          dense
          hide-details
          prefix="1:"
          @change="handleScaleChange"
        >
          <template #prepend>
            <div class="text-body-2 text--secondary">Scale</div>
          </template>
          <template #append class="align-self-end">
            <v-icon dense @click="handleScaleReset"> mdi-refresh </v-icon>
          </template>
          <!-- <template #append-outer>
            <v-btn small @click="handleScaleChange">Scale</v-btn>
          </template> -->
        </v-text-field>
      </v-toolbar>
      <v-divider />
      <!-- <div>Current scale: {{ currentScale }}</div> -->
      <div class="overflow-x-auto">
        <v-chart
          ref="flogChart"
          class="chart pa-2"
          :style="{
            height: `${(scaleChart ? chartHeightScaled : chartHeight) + 200}px`,
          }"
          v-bind="$attrs"
          autoresize
          :init-options="initOptions"
          :option="options"
          :update-options="{
            notMerge: false,
            replaceMerge: ['grid', 'xAxis', 'yAxis', 'series', 'title'],
          }"
          v-on="$listeners"
          @click="handleClick"
          @datazoom="handleDataZoom"
          @rendered="handleRendered"
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
  name: 'ChartFlogNew',
  components: {
    RendererSwitch,
    OptionsMethodTreeView,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
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
      currentMinDepth: this.minDepth,
      currentMaxDepth: this.maxDepth,
      selectedParameters: [],
      parameterChartWidth: 200,
      parameterChartPadding: 50,
      parameterModulePadding: 40,
      sampleChartWidth: 100,
      sampleChartPaddingLeft: 100,
      chartHeight: 618,
      chartHeightScaled: 618,
      // chartScale: 1 / 1000,
      scale: parseFloat(
        (((this.maxDepth - this.minDepth) * 1000) / this.px2mm(618)).toFixed(2)
      ),
      currentScale: parseFloat(
        (((this.maxDepth - this.minDepth) * 1000) / this.px2mm(618)).toFixed(2)
      ),
      scaleChart: true,
      options: {},
      nextGridIndex: 4,
    }
  },
  computed: {
    ...mapFields('chart', ['renderer', 'connected']),
    titleSubtext() {
      return this.$t('flogChart.titleSubtext', {
        scale: this.currentScale,
        minDepth: this.currentMaxDepth.toFixed(2),
        maxDepth: this.currentMinDepth.toFixed(2),
      })
    },
    chartScale() {
      return 1 / (this.currentMaxDepth - this.currentMinDepth)
    },
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
    this.options = this.initializeOption()
  },
  methods: {
    mm2px(mm) {
      return mm * 3.7795275591
    },
    px2mm(px) {
      return px / 3.7795275591
    },
    scaleChartHeight() {
      return this.mm2px(
        (this.currentMaxDepth - this.currentMinDepth) * 1000 * (1 / this.scale)
      )
    },
    handleClick(event) {
      if (event.seriesName === 'samples') {
        const sampleId = event.data[3]
        if (sampleId) this.$openNuxtWindow('sample-id', { id: sampleId })
      }
    },
    handleDataZoom(event) {
      const datazoom = this.$refs.flogChart.getOption().dataZoom[0]
      this.currentMinDepth = datazoom.startValue
      this.currentMaxDepth = datazoom.endValue

      this.currentScale = parseFloat(
        (
          ((this.currentMaxDepth - this.currentMinDepth) * 1000) /
          this.px2mm(this.chartHeightScaled)
        ).toFixed(2)
      )

      this.options = {
        ...this.options,
        title: {
          id: 'main-title',
          subtext: this.titleSubtext,
        },
      }
    },
    handleMethodsUpdate(newSelectedParameters) {
      const addedParameters = newSelectedParameters.filter((newParam) => {
        return !this.selectedParameters.some(
          (param) => param.id === newParam.id
        )
      })
      this.selectedParameters = newSelectedParameters
      if (addedParameters.length > 0) {
        const newChartComponents = this.createParameterChartComponents(
          addedParameters[0],
          this.nextGridIndex,
          this.selectedParameters.length - 1
        )

        this.options = {
          ...this.options,
          grid: [...this.options.grid, newChartComponents.grid],
          xAxis: [...this.options.xAxis, newChartComponents.xAxis],
          yAxis: [...this.options.yAxis, newChartComponents.yAxis],
          series: [...this.options.series, newChartComponents.series],
          dataZoom: [
            {
              ...this.options.dataZoom[0],
              yAxisIndex: [
                ...this.options.dataZoom[0].yAxisIndex,
                this.nextGridIndex,
              ],
            },
          ],
        }
      } else {
        const newOptions = this.initializeOption()

        const dataZoomYAxes = this.$refs.flogChart
          .getOption()
          .grid.map((grid, i) => {
            if (grid === null) return -1
            return i
          })
          .filter((idx) => idx !== -1)

        this.options = {
          ...newOptions,
          grid: [
            ...newOptions.grid.map((grid) => {
              return {
                id: grid.id,
                width: grid.width,
                height: grid.height,
                left: grid.left,
              }
            }),
          ],
          xAxis: [
            ...newOptions.xAxis.map((axis) => {
              return { id: axis.id }
            }),
          ],
          yAxis: [
            ...newOptions.yAxis.map((axis) => {
              return { id: axis.id }
            }),
          ],
          series: [
            ...newOptions.series.map((series) => {
              return { id: series.id }
            }),
          ],
          dataZoom: [
            {
              ...newOptions.dataZoom[0],
              yAxisIndex: dataZoomYAxes,
            },
          ],
        }
      }
    },
    handleRendered() {
      const nullGridIndex = this.$refs.flogChart.getOption().grid.indexOf(null)
      this.nextGridIndex =
        nullGridIndex > -1 ? nullGridIndex : 1 + this.selectedParameters.length
    },
    handleScaleCheckboxChange(scaleChart) {
      const newOptions = this.initializeOption()

      this.options = {
        ...this.options,
        grid: newOptions.grid.map((grid) => {
          return { id: grid.id, height: grid.height }
        }),
      }
      if (scaleChart) {
        this.currentScale = parseFloat(
          (
            ((this.currentMaxDepth - this.currentMinDepth) * 1000) /
            this.px2mm(this.chartHeightScaled)
          ).toFixed(2)
        )
      } else {
        this.currentScale = parseFloat(
          (
            ((this.currentMaxDepth - this.currentMinDepth) * 1000) /
            this.px2mm(this.chartHeight)
          ).toFixed(2)
        )
      }
    },
    handleScaleReset() {
      this.scale = parseFloat(
        (((this.maxDepth - this.minDepth) * 1000) / this.px2mm(618)).toFixed(2)
      )
      this.currentScale = this.scale
      this.chartHeightScaled = this.scaleChartHeight()

      const newOptions = this.initializeOption()

      this.options = {
        ...this.options,
        grid: newOptions.grid.map((grid) => {
          return { id: grid.id, height: grid.height }
        }),
      }
    },
    handleScaleChange(scale) {
      this.currentScale = parseFloat(this.scale).toFixed(2)
      this.chartHeightScaled = this.scaleChartHeight()
      const newOptions = this.initializeOption()

      this.options = {
        ...this.options,
        grid: newOptions.grid.map((grid) => {
          return { id: grid.id, height: grid.height }
        }),
      }
    },
    createParameterChartComponents(param, index, position) {
      return {
        grid: {
          id: `parameter-grid-${param.name}`,
          show: true,
          containLabel: false,
          left:
            this.sampleChartWidth +
            this.sampleChartPaddingLeft +
            position * (this.parameterChartWidth + this.parameterChartPadding) +
            this.parameterModulePadding,
          width: this.parameterChartWidth,
          top: 100,
          height: this.chartHeightScaled,
          borderWidth: 0,
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          },
        },
        xAxis: {
          id: `parameter-x-axis-${param.name}`,
          show: true,
          position: 'top',
          type: 'value',
          name: param.name,
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
          gridIndex: index,
          splitNumber: 2,
          axisPointer: {
            show: true,
          },
          axisLine: {
            show: true,
            symbol: ['none', 'arrow'],
            symbolSize: [5, 5],
          },
        },
        yAxis: {
          id: `parameter-y-axis-${param.name}`,
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
          gridIndex: index,
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
        },
        series: {
          id: `parameter-series-${param.name}`,
          name: param.name,
          type: 'line',
          smooth: false,
          xAxisIndex: index,
          yAxisIndex: index,
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
            .filter((result) => result.parameter === param.name)
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
      }
    },
    getOptions() {
      return this.options
    },
    initializeOption() {
      return {
        animation: false,
        title: {
          id: 'main-title',
          text: this.title,
          left: 60,
          subtext: this.titleSubtext,
        },
        grid: [
          {
            id: 'samples-grid',
            left: this.sampleChartPaddingLeft,
            containLabel: false,
            top: 100,
            width: this.sampleChartWidth,
            height: this.chartHeightScaled,
          },
          ...this.parameterGrid(this.selectedParameters),
          // { show: false, containLabel: false, left: 0, right: 0 },
        ],
        tooltip: {
          trigger: 'item',
        },
        dataZoom: [
          // TODO: yAxisIndex 0 should be `weakFilter` and others `empty`, if possible
          {
            type: 'inside',
            yAxisIndex: range(1 + this.selectedParameters.length),
            filterMode: 'empty',
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
            id: 'samples-x-axis',
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
            id: 'samples-y-axis',
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
            id: 'samples-series',
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
    parameterGrid(selectedParameters, startPosition = 1) {
      return selectedParameters.map((param, i) => {
        return {
          id: `parameter-grid-${param.name}`,
          show: true,
          containLabel: false,
          left:
            this.sampleChartWidth +
            this.sampleChartPaddingLeft +
            i * (this.parameterChartWidth + this.parameterChartPadding) +
            this.parameterModulePadding,
          top: 100,
          width: this.parameterChartWidth,
          height: this.chartHeightScaled,
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
          id: `parameter-x-axis-${selectedParam.name}`,
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
          id: `parameter-y-axis-${selectedParam.name}`,
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
          id: `parameter-series-${selectedParam.name}`,
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

<style scoped>
::v-deep .v-input__append-inner {
  align-self: flex-end !important;
}
</style>
