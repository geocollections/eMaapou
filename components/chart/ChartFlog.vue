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
            <div class="text-body-2 text--secondary">
              {{ $t('flogChart.heightScale') }}
            </div>
          </template>
          <template #append class="align-self-end">
            <v-icon dense @click="handleScaleReset"> mdi-refresh </v-icon>
          </template>
        </v-text-field>
      </v-toolbar>
      <v-divider />
      <div ref="containerFlogChart" class="overflow-x-auto">
        <v-chart
          ref="flogChart"
          class="chart pa-2"
          :style="{
            width: `${totalWidth}px`,
            height: `${currentHeight + 200}px`,
          }"
          v-bind="$attrs"
          autoresize
          :init-options="initOptions"
          :option="option"
          :update-options="updateOptions"
          v-on="$listeners"
          @click="handleClick"
          @datazoom="handleDataZoom"
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
      initialHeight: 618,
      currentHeight: 618,
      totalWidth: 0,
      scale: parseFloat(
        (((this.maxDepth - this.minDepth) * 1000) / this.px2mm(618)).toFixed(0)
      ),
      currentScale: parseFloat(
        (((this.maxDepth - this.minDepth) * 1000) / this.px2mm(618)).toFixed(0)
      ),
      option: {},
      nextGridIndex: 4,
      replace: true,
    }
  },
  computed: {
    ...mapFields('chart', ['renderer', 'connected']),
    initOptions() {
      return {
        renderer: this.renderer,
      }
    },
    updateOptions() {
      if (this.replace) {
        return {
          notMerge: false,
          replaceMerge: ['grid', 'xAxis', 'yAxis', 'series'],
        }
      }
      return {
        notMerge: false,
      }
    },
    titleSubtext() {
      return this.$t('flogChart.titleSubtext', {
        scale: this.currentScale,
        minDepth: this.currentMaxDepth.toFixed(2),
        maxDepth: this.currentMinDepth.toFixed(2),
      })
    },
    chartTitle() {
      return {
        id: 'main-title',
        text: this.title,
        left: 60,
        subtext: this.titleSubtext,
      }
    },
    chartWidth() {
      const parameterModuleWidth =
        this.selectedParameters.length *
          (this.parameterChartWidth + this.parameterChartPadding) +
        this.parameterModulePadding

      const totalWidth =
        this.sampleChartWidth +
        this.sampleChartPaddingLeft +
        parameterModuleWidth

      return `${totalWidth}px`
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
    this.totalWidth = this.calculateTotalWidth()
    this.option = this.createOption()
  },
  methods: {
    mm2px(mm) {
      return mm * 3.7795275591
    },
    px2mm(px) {
      return px / 3.7795275591
    },
    calculateScale(maxDepth, minDepth, chartHeight) {
      return ((maxDepth - minDepth) * 1000) / this.px2mm(chartHeight)
    },
    calculateTotalWidth() {
      const parameterModuleWidth =
        this.selectedParameters.length *
          (this.parameterChartWidth + this.parameterChartPadding) +
        this.parameterModulePadding

      const totalWidth =
        this.sampleChartWidth +
        this.sampleChartPaddingLeft +
        parameterModuleWidth

      if (this.$refs.containerFlogChart) {
        return this.$refs.containerFlogChart.clientWidth > totalWidth
          ? this.$refs.containerFlogChart.clientWidth
          : totalWidth
      }

      return totalWidth
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
      this.currentScale = this.calculateScale(
        this.currentMaxDepth,
        this.currentMinDepth,
        this.currentHeight
      ).toFixed(0)

      this.replace = false
      this.option = {
        title: {
          id: this.chartTitle.id,
          subtext: this.chartTitle.subtext,
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

      const nullGridIndex = this.$refs.flogChart.getOption().grid.indexOf(null)
      this.nextGridIndex =
        nullGridIndex > -1 ? nullGridIndex : this.selectedParameters.length
      this.totalWidth = this.calculateTotalWidth()

      if (addedParameters.length > 0) {
        const newChartComponents = this.createParameterChartComponents(
          addedParameters[0],
          this.nextGridIndex,
          this.selectedParameters.length - 1
        )

        this.replace = false
        this.option = {
          grid: newChartComponents.grid,
          xAxis: newChartComponents.xAxis,
          yAxis: newChartComponents.yAxis,
          series: newChartComponents.series,
          dataZoom: [
            {
              id: this.$refs.flogChart.getOption().dataZoom[0].id,
              yAxisIndex: [
                ...this.$refs.flogChart.getOption().dataZoom[0].yAxisIndex,
                this.nextGridIndex,
              ],
            },
          ],
        }
      } else {
        const newOptions = this.createOption()

        const dataZoomYAxes = this.$refs.flogChart
          .getOption()
          .grid.map((grid, i) => {
            if (grid === null) return -1
            return i
          })
          .filter((idx) => idx !== -1)

        this.replace = true
        this.option = {
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
    handleScaleReset() {
      this.scale = this.calculateScale(
        this.maxDepth,
        this.minDepth,
        this.initialHeight
      ).toFixed(0)
      this.currentScale = this.scale
      this.currentHeight = this.initialHeight

      this.replace = false
      this.option = {
        grid: this.$refs.flogChart.getOption().grid.map((grid) => {
          return { id: grid.id, height: this.currentHeight }
        }),
        title: this.chartTitle,
      }
    },
    handleScaleChange() {
      this.currentScale = parseFloat(this.scale).toFixed(2)
      this.currentHeight = this.scaleChartHeight()

      this.replace = false
      this.option = {
        grid: this.$refs.flogChart.getOption().grid.map((grid) => {
          return { id: grid.id, height: this.currentHeight }
        }),
        title: this.chartTitle,
      }
    },
    createParameterChartComponents(
      param,
      index,
      position,
      { returnComponents = ['grid', 'xAxis', 'yAxis', 'series'] } = {}
    ) {
      const result = {}

      if (returnComponents.includes('grid')) {
        result.grid = {
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
          height: this.currentHeight,
          borderWidth: 0,
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          },
        }
      }
      if (returnComponents.includes('xAxis')) {
        result.xAxis = {
          id: `parameter-x-axis-${param.name}`,
          show: true,
          position: 'top',
          type: 'value',
          name: param.name,
          nameLocation: 'center',
          nameTextStyle: {
            fontWeight: 'bold',
          },
          nameGap: 30,
          gridIndex: index,
          axisPointer: {
            show: true,
          },
          // axisLine: {
          // show: true,
          // symbol: ['none', 'arrow'],
          // symbolSize: [5, 5],
          // },
        }
      }
      if (returnComponents.includes('yAxis')) {
        result.yAxis = {
          id: `parameter-y-axis-${param.name}`,
          type: 'value',
          boundaryGap: false,
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
          },
          max: this.maxDepth,
          min: this.minDepth,
        }
      }
      if (returnComponents.includes('series')) {
        result.series = {
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
        }
      }
      return result
    },
    createSelectedParameterChartComponents({
      returnComponents = ['grid', 'xAxis', 'yAxis', 'series'],
    } = {}) {
      return this.selectedParameters.reduce(
        (prev, parameter, i) => {
          const parameterComponents = this.createParameterChartComponents(
            parameter,
            i + 1,
            i,
            { returnComponents }
          )
          return {
            grid: parameterComponents.grid && [
              ...prev.grid,
              parameterComponents.grid,
            ],
            xAxis: parameterComponents.xAxis && [
              ...prev.xAxis,
              parameterComponents.xAxis,
            ],
            yAxis: parameterComponents.yAxis && [
              ...prev.yAxis,
              parameterComponents.yAxis,
            ],
            series: parameterComponents.series && [
              ...prev.series,
              parameterComponents.series,
            ],
          }
        },
        { grid: [], xAxis: [], yAxis: [], series: [] }
      )
    },
    createOption() {
      const selectedParameterChartComponents = this.selectedParameters.reduce(
        (prev, parameter, i) => {
          const parameterComponents = this.createParameterChartComponents(
            parameter,
            i + 1,
            i
          )
          return {
            grid: [...prev.grid, parameterComponents.grid],
            xAxis: [...prev.xAxis, parameterComponents.xAxis],
            yAxis: [...prev.yAxis, parameterComponents.yAxis],
            series: [...prev.series, parameterComponents.series],
          }
        },
        { grid: [], xAxis: [], yAxis: [], series: [] }
      )

      return {
        animation: false,
        title: this.chartTitle,
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
          orient: 'vertical',
          left: 'left',
          feature: {
            dataZoom: {
              yAxisIndex: 'none',
              xAxisIndex: 'all',
              filterMode: 'none',
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
        grid: [
          {
            id: 'samples-grid',
            left: this.sampleChartPaddingLeft,
            containLabel: false,
            top: 100,
            width: this.sampleChartWidth,
            height: this.currentHeight,
          },
          ...selectedParameterChartComponents.grid,
        ],
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
          ...selectedParameterChartComponents.xAxis,
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
            },
            gridIndex: 0,
            max: this.maxDepth,
            min: this.minDepth,
          },
          ...selectedParameterChartComponents.yAxis,
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
              formatter: '{@[4]}',
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
          ...selectedParameterChartComponents.series,
        ],
      }
    },
  },
}
</script>

<style scoped>
::v-deep .v-input__append-inner {
  align-self: flex-end !important;
}
</style>
