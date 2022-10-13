<template>
  <div class="">
    <v-toolbar flat dense>
      <options-parameter-tree-view
        :parameters="parameters"
        :initial-selection="selectedParameters"
        @input="handleParametersUpdate"
      />
      <v-menu
        transition="slide-y-transition"
        offset-y
        content-class="white"
        :close-on-content-click="false"
      >
        <template #activator="{ on, attrs }">
          <v-btn class="ml-3" icon small v-bind="attrs" v-on="on">
            <v-icon> mdi-cog </v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title
            class="montserrat pb-2"
            v-text="$t('flogChart.settings')"
          />
          <v-card-text>
            <renderer-switch
              :renderer="renderer"
              @update="handleRenderSwitch"
            />
            <v-divider class="my-2" />
            <v-text-field
              v-model="scale"
              type="number"
              :label="$t('flogChart.heightScale')"
              prefix="1:"
              hide-details
              @change="handleScaleChange"
            >
              <template #append>
                <v-icon @click="handleScaleReset"> mdi-refresh </v-icon>
              </template>
              <template #append-outer>
                <v-btn-toggle
                  dense
                  color="accent"
                  :value="ppi"
                  @change="handlePpiChange"
                >
                  <v-btn
                    width="65"
                    small
                    class="text-none montserrat"
                    :outlined="ppi !== 96"
                    :value="96"
                  >
                    96 PPI
                  </v-btn>
                  <v-btn
                    width="65"
                    small
                    class="text-none montserrat"
                    :outlined="ppi !== 72"
                    :value="72"
                  >
                    72 PPI
                  </v-btn>
                </v-btn-toggle>
              </template>
            </v-text-field>
            <v-text-field
              :value="parameterChartWidth"
              type="number"
              class="d-inline-flex"
              hide-details
              suffix="px"
              :label="$t('flogChart.parameterChartWidth')"
              @change="handleParameterChartWidthChange"
            />
          </v-card-text>
        </v-card>
      </v-menu>
    </v-toolbar>
    <v-divider />
    <div ref="containerFlogChart" class="overflow-x-auto">
      <client-only>
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
        <template #placeholder>
          <div
            :style="`height: ${initialHeight + 200}px; width: 100%`"
            class="d-flex align-center justify-center"
          >
            <v-progress-circular
              indeterminate
              color="accent"
              :size="100"
              :width="6"
            />
          </div>
        </template>
      </client-only>
    </div>
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import groupBy from 'lodash/groupBy'
import orderBy from 'lodash/orderBy'
import differenceBy from 'lodash/differenceBy'
import RendererSwitch from '~/components/chart/options/RendererSwitch.vue'
import OptionsParameterTreeView from '~/components/chart/options/OptionsParameterTreeView.vue'
import range from '~/utils/range'
import clipRectByRect from '~/utils/clipRectByRect'
export default {
  name: 'ChartFlog',
  components: {
    RendererSwitch,
    OptionsParameterTreeView,
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
    parameters: {
      type: Array,
      required: true,
    },
    reverse: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentMinDepth: this.minDepth,
      currentMaxDepth: this.maxDepth,
      selectedParameters: [],
      parameterChartWidth: 150,
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
    ...mapFields('chart', ['renderer', 'connected', 'ppi']),
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
    selectedParametersGrouped() {
      return this.groupParameters(this.selectedParameters)
    },
    methods() {
      return this.parameters.reduce((prev, method) => {
        return { ...prev, [method.value]: method }
      }, {})
    },
  },
  created() {
    // Set initial selected parameters
    if (this.parameters.length > 0) {
      this.selectedParameters = this.parameters[0].children.slice(
        0,
        this.parameters[0].children.length > 3
          ? 3
          : this.parameters[0].children.length
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
        this.selectedParametersGrouped.length *
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
      return (
        this.mm2px(
          (this.currentMaxDepth - this.currentMinDepth) *
            1000 *
            (1 / this.scale)
        ) *
        (this.ppi / 96)
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
    groupParameters(parameters) {
      const grouped = groupBy(parameters, 'value')
      return orderBy(
        Object.entries(grouped).map(([paramId, params]) => {
          return {
            id: params[0].id,
            value: parseInt(paramId),
            name: params[0].name,
            count: params[0].count,
            methods: grouped[paramId].map((p) => p.methodValue),
          }
        }),
        ['id'],
        ['asc']
      )
    },
    handleRenderSwitch(event) {
      this.renderer = event
      this.replace = true
      this.option = this.$refs.flogChart.getOption()
    },
    handlePpiChange(event) {
      this.ppi = event
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
    handleParametersUpdate(newSelectedParameters) {
      const addedParameters = newSelectedParameters.filter((newParam) => {
        return !this.selectedParameters.some(
          (param) => param.id === newParam.id
        )
      })
      const removedParameters = this.selectedParameters.filter((newParam) => {
        return !newSelectedParameters.some((param) => param.id === newParam.id)
      })
      const oldGroupedParameters = this.groupParameters(this.selectedParameters)

      this.selectedParameters = newSelectedParameters

      const groupedParameters = this.groupParameters(this.selectedParameters)

      this.totalWidth = this.calculateTotalWidth()

      if (addedParameters.length > 0) {
        const newDataZoomYAxisIndices = [
          ...this.$refs.flogChart.getOption().dataZoom[0].yAxisIndex,
        ]
        let parameterGridIndex = 0
        let fromIndex = 0
        let parameterGridPosition = 0
        const newOptions = addedParameters.reduce(
          (prev, addedParameter, i) => {
            // if the `addedParameter` already has a chart, i.e. same parameter, different method. Update the series data.
            if (
              groupBy(newSelectedParameters, 'value')[addedParameter.value]
                .length > 1
            ) {
              const series = this.$refs.flogChart
                .getOption()
                .series.find((series) =>
                  series?.id.endsWith(`-${addedParameter.value}`)
                )
              const newChartComponents = this.createParameterChartComponents(
                groupedParameters.find((param) => {
                  return param.value === addedParameter.value
                }),
                series.xAxisIndex,
                -1,
                { returnComponents: ['series'] }
              )
              return {
                ...prev,
                series: [
                  ...prev.series,
                  ...newChartComponents.series,
                  // {
                  //   id: newChartComponents.series.id,
                  //   data: newChartComponents.series.data,
                  // },
                ],
              }
            } else {
              const nullGridIndex = this.$refs.flogChart
                .getOption()
                .grid.indexOf(null, fromIndex)

              // if empty spot in echarts grid list, use the empty spot index as `gridIndex`, as echarts wants these empty spaces to be filled
              if (nullGridIndex > -1) {
                this.nextGridIndex = nullGridIndex
                fromIndex = nullGridIndex + 1
                const newChartComponents = this.createParameterChartComponents(
                  groupedParameters.find((param) => {
                    return param.value === addedParameter.value
                  }),
                  this.nextGridIndex,
                  oldGroupedParameters.length + parameterGridPosition
                )

                parameterGridPosition += 1
                return {
                  grid: [...prev.grid, newChartComponents.grid],
                  xAxis: [...prev.xAxis, newChartComponents.xAxis],
                  yAxis: [...prev.yAxis, newChartComponents.yAxis],
                  series: [...prev.series, ...newChartComponents.series],
                }
              } else {
                this.nextGridIndex =
                  this.$refs.flogChart.getOption().grid.length +
                  parameterGridIndex
                const newChartComponents = this.createParameterChartComponents(
                  groupedParameters.find((param) => {
                    return param.value === addedParameter.value
                  }),
                  this.nextGridIndex,
                  oldGroupedParameters.length + parameterGridPosition
                )
                parameterGridIndex += 1
                parameterGridPosition += 1
                return {
                  grid: [...prev.grid, newChartComponents.grid],
                  xAxis: [...prev.xAxis, newChartComponents.xAxis],
                  yAxis: [...prev.yAxis, newChartComponents.yAxis],
                  series: [...prev.series, ...newChartComponents.series],
                }
              }
            }
          },
          { grid: [], xAxis: [], yAxis: [], series: [] }
        )
        this.replace = false
        this.option = {
          ...newOptions,
          dataZoom: [
            {
              id: this.$refs.flogChart.getOption().dataZoom[0].id,
              yAxisIndex: newDataZoomYAxisIndices,
            },
          ],
        }
      } else {
        const removed = differenceBy(
          oldGroupedParameters,
          groupedParameters,
          'value'
        )
        const modified = differenceBy(removedParameters, removed, 'value')

        const currentOption = this.$refs.flogChart.getOption()
        const gridsOrdered = orderBy(currentOption.grid, ['left'], ['asc'])
        let position = 0

        const newOptions = gridsOrdered.reduce(
          (prev, grid, i) => {
            if (grid == null) {
              return prev
            }

            if (!grid.id.startsWith('parameter')) {
              // !!! using `i` is not correct as the grids have been reordered
              // this should not cause any problems right now but, could when other chart tpyes are added (taxon, stratigraphy) or when samples chart can be disabled
              return {
                ...prev,
                grid: [...prev.grid, { id: grid.id }],
                xAxis: [...prev.xAxis, { id: currentOption.xAxis[i].id }],
                yAxis: [...prev.yAxis, { id: currentOption.yAxis[i].id }],
                series: [...prev.series, { id: currentOption.series[i].id }],
              }
            }
            const parameterValueStr = grid.id.split('-')[2]
            const parameterValue = parseInt(parameterValueStr)
            const xAxis = currentOption.xAxis.find((xAxis) =>
              xAxis?.id.endsWith(`-${parameterValueStr}`)
            )
            const yAxis = currentOption.yAxis.find((yAxis) =>
              yAxis?.id.endsWith(`-${parameterValueStr}`)
            )
            const series = currentOption.series.filter((series) =>
              series?.id.endsWith(`-${parameterValueStr}`)
            )

            // if one of the parameter methods removed but some method, for that parameter, still selected,
            // update series data and grid position
            if (modified.some((m) => m.value === parameterValue)) {
              const param = groupedParameters.find(
                (m) => m.value === parameterValue
              )
              const newChartComponents = this.createParameterChartComponents(
                param,
                xAxis.gridIndex,
                position,
                { returnComponents: ['series', 'grid'] }
              )
              position += 1

              return {
                ...prev,
                grid: [
                  ...prev.grid,
                  {
                    id: grid.id,
                    left: newChartComponents.grid.left,
                  },
                ],
                xAxis: [...prev.xAxis, { id: xAxis.id }],
                yAxis: [...prev.yAxis, { id: yAxis.id }],
                series: [
                  ...prev.series,
                  ...newChartComponents.series,
                  // {
                  //   id: series.id,
                  //   data: newChartComponents.series.data,
                  // },
                ],
              }
            }
            // if chart is not modified or removed, leave it as is, only update grid position.
            if (!removed.some((m) => m.value === parameterValue)) {
              const param = groupedParameters.find(
                (m) => m.value === parameterValue
              )
              const newChartComponents = this.createParameterChartComponents(
                param,
                -1,
                position,
                { returnComponents: ['grid'] }
              )
              position += 1
              return {
                ...prev,
                grid: [
                  ...prev.grid,
                  {
                    id: grid.id,
                    left: newChartComponents.grid.left,
                  },
                ],
                xAxis: [...prev.xAxis, { id: xAxis.id }],
                yAxis: [...prev.yAxis, { id: yAxis.id }],
                series: [...prev.series, ...series],
              }
            }
            return prev
          },
          { grid: [], xAxis: [], yAxis: [], series: [] }
        )

        this.replace = true
        this.option = newOptions
      }
    },
    handleScaleReset() {
      this.scale = this.calculateScale(
        this.maxDepth,
        this.minDepth,
        this.initialHeight
      ).toFixed(0)
      this.currentScale = this.scale
      this.ppi = 96
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
    handleParameterChartWidthChange(event) {
      this.parameterChartWidth = parseInt(event)

      this.totalWidth = this.calculateTotalWidth()
      this.replace = false
      this.option = {
        grid: this.$refs.flogChart.getOption().grid.map((grid, i) => {
          if (!grid.id.startsWith('parameter')) {
            return { id: grid.id }
          }
          return {
            id: grid.id,
            width: this.parameterChartWidth,
            left: this.calcParameterChartLeft(i - 1),
          }
        }),
        title: this.chartTitle,
      }
    },
    calcParameterChartLeft(position) {
      return (
        this.sampleChartWidth +
        this.sampleChartPaddingLeft +
        position * (this.parameterChartWidth + this.parameterChartPadding) +
        this.parameterModulePadding
      )
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
          id: `parameter-grid-${param.value}`,
          show: true,
          containLabel: false,
          left: this.calcParameterChartLeft(position),
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
          id: `parameter-x-axis-${param.value}`,
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
          axisLabel: {
            showMinLabel: true,
            showMaxLabel: true,
            hideOverlap: true,
          },
        }
      }
      if (returnComponents.includes('yAxis')) {
        result.yAxis = {
          id: `parameter-y-axis-${param.value}`,
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
        result.series = param.methods.map((method) => {
          return {
            id: `parameter-series-${method}-${param.value}`,
            name: `(${this.$translate({
              et: this.methods[method].name,
              en: this.methods[method].name_en,
            })}) ${param.name}`,
            type: 'line',
            smooth: false,
            xAxisIndex: index,
            yAxisIndex: index,
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
              .filter(
                (result) =>
                  result.parameter === param.name && method === result.method_id
              )
              .map((t) => {
                const avgDepth = t.depth_interval
                  ? (t.depth + t.depth_interval) / 2
                  : t.depth
                return [
                  t.value,
                  this.reverse ? -avgDepth : avgDepth,
                  this.reverse ? -t.depth : t.depth,
                  this.reverse ? -t.depth_interval : t.depth_interval,
                  t.analysis_id,
                ]
              })
              .sort((a, b) => a[1] - b[1]),
            emphasis: {
              focus: 'series',
            },
          }
        })
      }
      return result
    },
    createOption() {
      const selectedParameterChartComponents = this.groupParameters(
        this.selectedParameters
      ).reduce(
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
            series: [...prev.series, ...parameterComponents.series],
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
        legend: {
          bottom: '20',
          left: 'center',
        },
        dataZoom: [
          {
            id: 'dataZoom-y-inside',
            type: 'inside',
            yAxisIndex: range(1 + this.selectedParameters.length),
            filterMode: 'none',
            minValueSpan: 0.1,
          },
          {
            id: 'dataZoom-y-slider',
            type: 'slider',
            yAxisIndex: 0,
            realtime: false,
            minValueSpan: 0.1,
            width: 20,
            left: 10,
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
            saveAsImage: {
              excludeComponents: ['toolbox', 'dataZoom'],
            },
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
            data: [this.$t('flogChart.samples')],
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
            name: this.$t('flogChart.samples'),
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
              const switchDepths = api.value(1) < depthInterval
              const startDepth = switchDepths ? depthInterval : api.value(1)
              const endDepth = switchDepths ? api.value(1) : depthInterval
              const start = api.coord([categoryIndex, startDepth])
              const end = api.coord([categoryIndex, endDepth])

              const categoryWidth = api.size([0, 1])[0]
              const dynamicHeight = end[1] - start[1]
              const height =
                api.value(2) || dynamicHeight < 10 ? dynamicHeight : 10
              const x = start[0] - categoryWidth * 0.5
              const y = api.value(2) ? start[1] : start[1] - height / 2
              // console.log(y, height)
              const rectShape = clipRectByRect(
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
                  transition: [],
                  shape: rectShape,
                  style: { ...api.style(), fill: '#000000' },
                  emphasis: {
                    style: api.style(),
                  },
                }
              )
            },
            data: this.samples.map((item) => {
              return [
                0,
                this.reverse ? -item.depth : item.depth,
                this.reverse ? -item.depth_interval : item.depth_interval,
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
