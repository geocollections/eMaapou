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
            <v-icon> {{ icons.mdiCog }} </v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="montserrat pb-2">
            {{ $t('flogChart.settings') }}
          </v-card-title>
          <v-card-text>
            <renderer-switch
              :renderer="$accessor.chart.renderer"
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
                <v-icon @click="handleScaleReset">
                  {{ icons.mdiRefresh }}
                </v-icon>
              </template>
              <template #append-outer>
                <v-btn-toggle
                  dense
                  color="accent"
                  :value="$accessor.chart.ppi"
                  @change="handlePpiChange"
                >
                  <v-btn
                    width="65"
                    small
                    class="text-none montserrat"
                    :outlined="$accessor.chart.ppi !== 96"
                    :value="96"
                  >
                    96 PPI
                  </v-btn>
                  <v-btn
                    width="65"
                    small
                    class="text-none montserrat"
                    :outlined="$accessor.chart.ppi !== 72"
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

<script lang="ts">
import { mdiCog, mdiRefresh } from '@mdi/js'
import groupBy from 'lodash/groupBy'
import orderBy from 'lodash/orderBy'
import differenceBy from 'lodash/differenceBy'
import { PropType } from 'vue'
import {
  DataZoomComponentOption,
  GridComponentOption,
  TooltipComponentOption,
  TitleComponentOption,
  AxisPointerComponentOption,
  TitleComponent,
  TooltipComponent,
  DataZoomComponent,
  AxisPointerComponent,
  ToolboxComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import {
  XAXisComponentOption,
  YAXisComponentOption,
} from 'echarts/types/dist/echarts'
import {
  LineSeriesOption,
  CustomSeriesOption,
  CustomChart,
  LineChart,
} from 'echarts/charts'
import VChart from 'vue-echarts'
import { ComposeOption, use } from 'echarts/core'
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'
import {
  defineComponent,
  reactive,
  toRefs,
  computed,
  useContext,
  ref,
} from '@nuxtjs/composition-api'
import { TitleOption } from 'echarts/types/dist/shared'
import RendererSwitch from '~/components/chart/options/RendererSwitch.vue'
import OptionsParameterTreeView from '~/components/chart/options/OptionsParameterTreeView.vue'
import range from '~/utils/range'
import clipRectByRect from '~/utils/clipRectByRect'
import mm2px from '~/utils/mm2px'
import px2mm from '~/utils/px2mm'
import { IFlogMethod, IFlogParameter } from '~/utils/flogParameters'
import { useAccessor } from '~/composables/useAccessor'
import { Renderer } from '~/types/enums'
type ECOption = ComposeOption<
  | GridComponentOption
  | LineSeriesOption
  | CustomSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | DataZoomComponentOption
  | AxisPointerComponentOption
>
interface GroupedParameter {
  id: number
  value: number
  name: string
  count: number
  methods: any[]
}
use([
  CanvasRenderer,
  SVGRenderer,
  CustomChart,
  LineChart,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  DataZoomComponent,
  AxisPointerComponent,
  ToolboxComponent,
  LegendComponent,
])

export default defineComponent({
  name: 'ChartFlog',
  components: {
    RendererSwitch,
    OptionsParameterTreeView,
    VChart,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    analyses: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    samples: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    taxa: {
      type: Array as PropType<any[]>,
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
      type: Array as PropType<IFlogMethod[]>,
      required: true,
    },
    reverse: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const accessor = useAccessor()
    const { i18n, $openNuxtWindow, localeLocation, $vuetify, $translate } =
      useContext()
    const state = reactive({
      currentMinDepth: props.minDepth,
      currentMaxDepth: props.maxDepth,
      selectedParameters: [] as IFlogParameter[],
      parameterChartWidth: 150,
      parameterChartPadding: 50,
      parameterModulePadding: 40,
      sampleChartWidth: 100,
      sampleChartPaddingLeft: 100,
      initialHeight: 618,
      currentHeight: 618,
      totalWidth: 0,
      scale: parseFloat(
        (((props.maxDepth - props.minDepth) * 1000) / px2mm(618)).toFixed(0)
      ),
      currentScale: parseFloat(
        (((props.maxDepth - props.minDepth) * 1000) / px2mm(618)).toFixed(0)
      ),
      option: {},
      nextGridIndex: 4,
      replace: true,
    })

    const containerFlogChart = ref<HTMLElement>()
    const flogChart = ref<typeof VChart>()

    const icons = computed(() => {
      return {
        mdiCog,
        mdiRefresh,
      }
    })
    const initOptions = computed(() => {
      return {
        renderer: accessor.chart.renderer,
      }
    })
    const updateOptions = computed(() => {
      if (state.replace) {
        return {
          notMerge: false,
          replaceMerge: ['xAxis', 'yAxis', 'series', 'grid'],
        }
      }
      return {
        notMerge: false,
      }
    })
    const titleSubtext = computed(() => {
      return i18n
        .t('flogChart.titleSubtext', {
          scale: state.currentScale,
          minDepth: state.currentMaxDepth.toFixed(2),
          maxDepth: state.currentMinDepth.toFixed(2),
        })
        .toString()
    })
    const chartTitle = computed((): TitleOption => {
      return {
        id: 'main-title',
        text: props.title,
        left: 60,
        subtext: titleSubtext.value,
      }
    })
    const methods = computed(() => {
      return props.parameters.reduce((prev, method) => {
        return { ...prev, [method.value]: method }
      }, {} as { [K: string]: IFlogMethod })
    })
    const selectedParametersGrouped = computed(() => {
      return groupParameters(state.selectedParameters)
    })
    const calculateScale = (
      maxDepth: number,
      minDepth: number,
      chartHeight: number
    ) => {
      return ((maxDepth - minDepth) * 1000) / px2mm(chartHeight)
    }
    const calculateTotalWidth = () => {
      const parameterModuleWidth =
        selectedParametersGrouped.value.length *
          (state.parameterChartWidth + state.parameterChartPadding) +
        state.parameterModulePadding

      const totalWidth =
        state.sampleChartWidth +
        state.sampleChartPaddingLeft +
        parameterModuleWidth

      if (containerFlogChart.value) {
        return containerFlogChart.value.clientWidth &&
          containerFlogChart.value.clientWidth > totalWidth
          ? containerFlogChart.value.clientWidth
          : totalWidth
      }

      return totalWidth
    }
    const scaleChartHeight = () => {
      return (
        mm2px(
          (state.currentMaxDepth - state.currentMinDepth) *
            1000 *
            (1 / state.scale)
        ) *
        (accessor.chart.ppi / 96)
      )
    }
    const handleClick = (event: any) => {
      // TODO: `any` should be replaced with the correct event type from echarts
      if (event.seriesName === 'samples') {
        const sampleId = event.data[3]
        if (sampleId)
          $openNuxtWindow(
            localeLocation({ name: 'sample-id', params: { id: sampleId } })
          )
      }
    }
    const handleDataZoom = () => {
      const datazoom = flogChart.value?.getOption().dataZoom[0]
      state.currentMinDepth = datazoom.startValue
      state.currentMaxDepth = datazoom.endValue
      state.currentScale = calculateScale(
        state.currentMaxDepth,
        state.currentMinDepth,
        state.currentHeight
      )

      state.replace = false
      state.option = {
        title: {
          id: chartTitle.value.id,
          subtext: chartTitle.value.subtext,
        },
      }
    }
    const groupParameters = (parameters: any[]): GroupedParameter[] => {
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
    }
    const handleRenderSwitch = (newRenderer: Renderer) => {
      accessor.chart.setRenderer(newRenderer)
      state.replace = true
      state.option = flogChart.value?.getOption()
    }
    const handlePpiChange = (newPpi: string) => {
      accessor.chart.setPpi(parseInt(newPpi))
      state.currentScale = state.scale
      state.currentHeight = scaleChartHeight()
      state.replace = false
      state.option = {
        grid: flogChart.value
          ?.getOption()
          .grid.map((grid: GridComponentOption) => {
            return { id: grid.id, height: state.currentHeight }
          }),
        title: chartTitle.value,
      }
    }
    const handleParametersUpdate = (newSelectedParameters: any[]) => {
      const chart = flogChart.value

      const addedParameters = newSelectedParameters.filter((newParam) => {
        return !state.selectedParameters.some(
          (param) => param.id === newParam.id
        )
      })
      const removedParameters = state.selectedParameters.filter((newParam) => {
        return !newSelectedParameters.some((param) => param.id === newParam.id)
      })
      const oldGroupedParameters = groupParameters(state.selectedParameters)

      state.selectedParameters = newSelectedParameters

      const groupedParameters = groupParameters(state.selectedParameters)

      state.totalWidth = calculateTotalWidth()

      if (addedParameters.length > 0) {
        const newDataZoomYAxisIndices = [
          ...chart?.getOption().dataZoom[0].yAxisIndex,
        ]
        let parameterGridIndex = 0
        let fromIndex = 0
        let parameterGridPosition = 0
        const newOptions = addedParameters.reduce(
          (prev, addedParameter) => {
            // if the `addedParameter` already has a chart, i.e. same parameter, different method. Update the series data.
            if (
              groupBy(newSelectedParameters, 'value')[addedParameter.value]
                .length > 1
            ) {
              const series = chart
                ?.getOption()
                .series.find((series: LineSeriesOption) =>
                  (series.id as string)?.endsWith(`-${addedParameter.value}`)
                )
              const newChartComponents = createParameterChartComponents(
                groupedParameters.find((param: any) => {
                  return param.value === addedParameter.value
                }) as GroupedParameter,
                series.xAxisIndex,
                -1,
                { returnComponents: ['series'] }
              )
              return {
                ...prev,
                series: [
                  ...prev.series,
                  ...(newChartComponents.series as LineSeriesOption[]),
                  // {
                  //   id: newChartComponents.series.id,
                  //   data: newChartComponents.series.data,
                  // },
                ],
              }
            } else {
              const nullGridIndex = chart
                ?.getOption()
                .grid.indexOf(null, fromIndex)

              // if empty spot in echarts grid list, use the empty spot index as `gridIndex`, as echarts wants these empty spaces to be filled
              if (nullGridIndex > -1) {
                state.nextGridIndex = nullGridIndex
                newDataZoomYAxisIndices.push(state.nextGridIndex)
                fromIndex = nullGridIndex + 1
                const newChartComponents = createParameterChartComponents(
                  groupedParameters.find((param: any) => {
                    return param.value === addedParameter.value
                  }) as GroupedParameter,
                  state.nextGridIndex,
                  oldGroupedParameters.length + parameterGridPosition
                )

                parameterGridPosition += 1
                return {
                  grid: [...prev.grid, newChartComponents.grid],
                  xAxis: [...prev.xAxis, newChartComponents.xAxis],
                  yAxis: [...prev.yAxis, newChartComponents.yAxis],
                  series: [
                    ...prev.series,
                    ...(newChartComponents.series as LineSeriesOption[]),
                  ],
                }
              } else {
                state.nextGridIndex =
                  chart?.getOption().grid.lenthisgth + parameterGridIndex
                newDataZoomYAxisIndices.push(state.nextGridIndex)
                const newChartComponents = createParameterChartComponents(
                  groupedParameters.find((param: any) => {
                    return param.value === addedParameter.value
                  }) as GroupedParameter,
                  state.nextGridIndex,
                  oldGroupedParameters.length + parameterGridPosition
                )
                parameterGridIndex += 1
                parameterGridPosition += 1
                return {
                  grid: [...prev.grid, newChartComponents.grid],
                  xAxis: [...prev.xAxis, newChartComponents.xAxis],
                  yAxis: [...prev.yAxis, newChartComponents.yAxis],
                  series: [
                    ...prev.series,
                    ...(newChartComponents.series as LineSeriesOption[]),
                  ],
                }
              }
            }
          },
          { grid: [], xAxis: [], yAxis: [], series: [] }
        )
        state.replace = false
        state.option = {
          ...newOptions,
          dataZoom: [
            {
              id: chart?.getOption().dataZoom[0].id,
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

        const currentOption = chart?.getOption()
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

            const xAxis = currentOption.xAxis.find(
              (xAxis: XAXisComponentOption) =>
                (xAxis?.id as string)?.endsWith(`-${parameterValueStr}`)
            )
            const yAxis = currentOption.yAxis.find(
              (yAxis: YAXisComponentOption) =>
                (yAxis?.id as string)?.endsWith(`-${parameterValueStr}`)
            )
            const series = currentOption.series.filter(
              (series: LineSeriesOption) =>
                (series?.id as string)?.endsWith(`-${parameterValueStr}`)
            )

            // if one of the parameter methods removed but some method, for that parameter, still selected,
            // update series data and grid position
            if (modified.some((m) => m.value === parameterValue)) {
              const param = groupedParameters.find(
                (m) => m.value === parameterValue
              ) as GroupedParameter
              const newChartComponents = createParameterChartComponents(
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
                    left: newChartComponents.grid?.left,
                  },
                ],
                xAxis: [...prev.xAxis, { id: xAxis.id }],
                yAxis: [...prev.yAxis, { id: yAxis.id }],
                series: [
                  ...prev.series,
                  ...(newChartComponents.series as LineSeriesOption[]),
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
              ) as GroupedParameter
              const newChartComponents = createParameterChartComponents(
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
                    left: (newChartComponents.grid as GridComponentOption).left,
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

        state.replace = true
        state.option = newOptions
      }
    }
    const handleScaleReset = () => {
      state.scale = calculateScale(
        props.maxDepth,
        props.minDepth,
        state.initialHeight
      )
      state.currentScale = state.scale
      accessor.chart.setPpi(96)
      state.currentHeight = state.initialHeight

      state.replace = false
      state.option = {
        grid: flogChart.value
          ?.getOption()
          .grid.map((grid: GridComponentOption) => {
            return { id: grid.id, height: state.currentHeight }
          }),
        title: chartTitle.value,
      }
    }
    const handleScaleChange = () => {
      state.currentScale = state.scale
      state.currentHeight = scaleChartHeight()

      state.replace = false
      state.option = {
        grid: flogChart.value
          ?.getOption()
          .grid.map((grid: GridComponentOption) => {
            return { id: grid.id, height: state.currentHeight }
          }),
        title: chartTitle.value,
      }
    }
    const handleParameterChartWidthChange = (
      newParameterChartWidth: string
    ) => {
      state.parameterChartWidth = parseInt(newParameterChartWidth)

      state.totalWidth = calculateTotalWidth()
      state.replace = false
      state.option = {
        grid: flogChart.value
          ?.getOption()
          .grid.map((grid: GridComponentOption, i: number) => {
            if (!(grid.id as string)?.startsWith('parameter')) {
              return { id: grid.id }
            }
            return {
              id: grid.id,
              width: state.parameterChartWidth,
              left: calcParameterChartLeft(i - 1),
            }
          }),
        title: chartTitle.value,
      }
    }
    const calcParameterChartLeft = (position: number) => {
      return (
        state.sampleChartWidth +
        state.sampleChartPaddingLeft +
        position * (state.parameterChartWidth + state.parameterChartPadding) +
        state.parameterModulePadding
      )
    }
    const createParameterChartComponents = (
      param: {
        id: any
        value: number
        name: any
        count: any
        methods: any[]
      },
      index: number,
      position: number,
      { returnComponents = ['grid', 'xAxis', 'yAxis', 'series'] } = {}
    ): {
      grid?: GridComponentOption
      xAxis?: XAXisComponentOption
      yAxis?: YAXisComponentOption
      series?: LineSeriesOption[]
    } => {
      const result = {} as {
        grid?: GridComponentOption
        xAxis?: XAXisComponentOption
        yAxis?: YAXisComponentOption
        series?: LineSeriesOption[]
      }

      if (returnComponents.includes('grid')) {
        result.grid = {
          id: `parameter-grid-${param.value}`,
          show: true,
          containLabel: false,
          left: calcParameterChartLeft(position),
          width: state.parameterChartWidth,
          top: 100,
          height: state.currentHeight,
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
          nameLocation: 'middle',
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
          nameGap: 10,
          splitNumber: 7,
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
          max: props.maxDepth,
          min: props.minDepth,
        }
      }
      if (returnComponents.includes('series')) {
        result.series = param.methods.map((method): LineSeriesOption => {
          return {
            id: `parameter-series-${method}-${param.value}`,
            name: `(${$translate({
              et: methods.value[method].name,
              en: methods.value[method].name_en,
            })}) ${param.name}`,
            type: 'line',
            smooth: false,
            xAxisIndex: index,
            yAxisIndex: index,
            lineStyle: {
              width: 1,
            },
            tooltip: {
              formatter(params: any) {
                // @ts-ignore
                const data: [number, number, number, number, string] =
                  params.data
                return `
                <span class="mr-2" style="display: inline-block; width: 10px; height: 10px; border-radius: 10px; background-color: ${
                  params.color
                }"></span>
                <span>
                  ${data[4]}<br />
                  ${params.seriesName}: <b>${data[0]}</b><br />
                  Depth: <b>${data[2]}</b>
                  ${data[3] ? `<br />Depth interval: <b>${data[3]}</b>` : ''}
                </span>
                `
              },
            },
            data: props.analyses
              .filter(
                (result: any) =>
                  result.parameter === param.name && method === result.method_id
              )
              .map((t) => {
                const avgDepth = t.depth_interval
                  ? (t.depth + t.depth_interval) / 2
                  : t.depth
                return [
                  t.value,
                  props.reverse ? -avgDepth : avgDepth,
                  props.reverse ? -t.depth : t.depth,
                  props.reverse ? -t.depth_interval : t.depth_interval,
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
    }
    const createOption = (): ECOption => {
      const selectedParameterChartComponents = groupParameters(
        state.selectedParameters
      ).reduce(
        (
          prev,
          parameter,
          i
        ): {
          grid: GridComponentOption[]
          xAxis: XAXisComponentOption[]
          yAxis: YAXisComponentOption[]
          series: LineSeriesOption[]
        } => {
          const parameterComponents = createParameterChartComponents(
            parameter,
            i + 1,
            i
          )
          return {
            grid: [
              ...prev.grid,
              parameterComponents.grid as GridComponentOption,
            ],
            xAxis: [
              ...prev.xAxis,
              parameterComponents.xAxis as XAXisComponentOption,
            ],
            yAxis: [
              ...prev.yAxis,
              parameterComponents.yAxis as YAXisComponentOption,
            ],
            series: [
              ...prev.series,
              ...(parameterComponents.series as LineSeriesOption[]),
            ],
          }
        },
        { grid: [], xAxis: [], yAxis: [], series: [] } as {
          grid: GridComponentOption[]
          xAxis: XAXisComponentOption[]
          yAxis: YAXisComponentOption[]
          series: LineSeriesOption[]
        }
      )

      return {
        animation: false,
        title: chartTitle.value,
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
            yAxisIndex: range(1 + state.selectedParameters.length),
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
        axisPointer: [
          {
            link: [{ yAxisIndex: 'all' }],
            triggerTooltip: false,
            label: {
              fontSize: 10,
              backgroundColor: $vuetify.theme.currentTheme.warning as string,
            },
            lineStyle: {
              color: $vuetify.theme.currentTheme.warning as string,
              width: 1,
            },
          },
        ],
        grid: [
          {
            id: 'samples-grid',
            left: state.sampleChartPaddingLeft,
            containLabel: false,
            top: 100,
            width: state.sampleChartWidth,
            height: state.currentHeight,
          },
          ...selectedParameterChartComponents.grid,
        ],
        xAxis: [
          {
            id: 'samples-x-axis',
            type: 'category',
            data: [i18n.t('flogChart.samples') as string],
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
            name: i18n.t('common.depth') as string,
            nameLocation: 'middle',
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
            max: props.maxDepth,
            min: props.minDepth,
          },
          ...selectedParameterChartComponents.yAxis,
        ],
        series: [
          {
            id: 'samples-series',
            type: 'custom',
            name: i18n.t('flogChart.samples') as string,
            xAxisIndex: 0,
            yAxisIndex: 0,
            tooltip: {
              position: 'bottom',
              formatter(params: any) {
                // @ts-ignore
                const data: [number, number, number, number, string] =
                  params.data

                return `
              <span class="mr-2" style="display: inline-block; width: 10px; height: 10px; border-radius: 10px; background-color: ${
                params.color
              }"></span>
              <span>
                ${data[4]}<br />
                Depth: <b>${data[1]}</b><br />
                ${data[2] ? `Depth interval: <b>${data[2]}</b>` : ''}
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
              // @ts-ignore
              formatter: '{@[4]}',
            },
            renderItem(params, api) {
              const categoryIndex = api.value(0)
              const depthInterval = api.value(2)
                ? api.value(2)
                : (api.value(1) as number) - 0.1
              const switchDepths = api.value(1) < depthInterval
              const startDepth = switchDepths ? depthInterval : api.value(1)
              const endDepth = switchDepths ? api.value(1) : depthInterval
              const start = api.coord([categoryIndex, startDepth])
              const end = api.coord([categoryIndex, endDepth])

              const categoryWidth = api.size
                ? (api.size([0, 1]) as number[])[0]
                : 0
              const dynamicHeight = end[1] - start[1]
              const height =
                api.value(2) || dynamicHeight < 10 ? dynamicHeight : 10
              const x = start[0] - categoryWidth * 0.5
              const y = api.value(2) ? start[1] : start[1] - height / 2
              const rectShape = clipRectByRect(
                {
                  x,
                  y,
                  width: 10,
                  height,
                },
                {
                  // @ts-ignore
                  x: params.coordSys.x,
                  // @ts-ignore
                  y: params.coordSys.y,
                  // @ts-ignore
                  width: params.coordSys.width,
                  // @ts-ignore
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
            data: props.samples.map((item: any) => {
              return [
                0,
                props.reverse ? -item.depth : item.depth,
                props.reverse ? -item.depth_interval : item.depth_interval,
                item.id,
                item.sample_number || item.sample_id,
              ]
            }),
          },
          ...selectedParameterChartComponents.series,
        ],
      }
    }
    // Set initial selected parameters
    if (props.parameters.length > 0) {
      state.selectedParameters = props.parameters[0].children.slice(
        0,
        props.parameters[0].children.length > 3
          ? 3
          : props.parameters[0].children.length
      )
    }
    state.totalWidth = calculateTotalWidth()
    state.option = createOption()
    return {
      ...toRefs(state),
      flogChart,
      containerFlogChart,
      handleParametersUpdate,
      handleRenderSwitch,
      handleScaleChange,
      handleScaleReset,
      handlePpiChange,
      handleParameterChartWidthChange,
      handleClick,
      handleDataZoom,
      initOptions,
      updateOptions,
      icons,
    }
  },
})
</script>

<style scoped>
::v-deep .v-input__append-inner {
  align-self: flex-end !important;
}
</style>
