<template>
  <div>
    <renderer-switch
      v-if="!hideRendererSwitch"
      :renderer="$accessor.chart.renderer"
      @update="$accessor.chart.setRenderer($event)"
    />
    <client-only>
      <v-chart
        class="chart"
        autoresize
        :init-options="initOptions"
        :option="option"
      />
    </client-only>
  </div>
</template>

<script lang="ts">
import VChart from 'vue-echarts'
import {
  AxisPointerComponent,
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
} from 'echarts/components'
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { SVGRenderer, CanvasRenderer } from 'echarts/renderers'
import {
  toRefs,
  defineComponent,
  reactive,
  useContext,
  computed,
  watch,
} from '@nuxtjs/composition-api'
import {
  DATAZOOM_Y_SLIDER_LEFT,
  DATAZOOM_Y_SLIDER_LEFT_SMALL,
  GRID_BOTTOM,
  GRID_LEFT,
  GRID_LEFT_SMALL,
  GRID_TOP,
  GRID_WIDTH,
  GRID_WIDTH_SMALL,
  TITLE_FONT_SIZE,
  TITLE_FONT_SIZE_SMALL,
  TITLE_TOP,
  TITLE_TOP_SMALL,
  TOOLBOX_RIGHT,
} from '~/constants'
import RendererSwitch from '~/components/chart/options/RendererSwitch.vue'
import { useAccessor } from '~/composables/useAccessor'

use([
  CanvasRenderer,
  SVGRenderer,
  LineChart,
  GridComponent,
  AxisPointerComponent,
  TooltipComponent,
  ToolboxComponent,
  DataZoomComponent,
  TitleComponent,
  LegendComponent,
])

export default defineComponent({
  name: 'ChartLas',
  components: { VChart, RendererSwitch },
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
    hideRendererSwitch: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props) {
    const { $vuetify } = useContext()
    const accessor = useAccessor()
    const state = reactive({
      option: {},
      defaultOptions: {
        // title also gets updated in watcher
        title: {
          text: 'Chart title',
          left: 'center',
          top: $vuetify.breakpoint.xsOnly ? TITLE_TOP_SMALL : TITLE_TOP,
          textStyle: {
            fontSize: $vuetify.breakpoint.xsOnly
              ? TITLE_FONT_SIZE_SMALL
              : TITLE_FONT_SIZE,
          },
        },
        // grid also gets updated in watcher
        grid: {
          show: true,
          top: GRID_TOP,
          bottom: GRID_BOTTOM,
          left: $vuetify.breakpoint.xsOnly ? GRID_LEFT_SMALL : GRID_LEFT,
          containLabel: true,
          width: $vuetify.breakpoint.xsOnly ? GRID_WIDTH_SMALL : GRID_WIDTH,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        },
        toolbox: {
          right: TOOLBOX_RIGHT,
          feature: {
            saveAsImage: {},
            restore: {},
            dataView: {},
            dataZoom: {},
            brush: {
              type: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
            },
          },
        },
        // dataZoom also gets updated in watcher
        dataZoom: [
          {
            type: 'slider',
            show: true,
            filterMode: 'empty',
          },
          {
            type: 'slider',
            show: true,
            yAxisIndex: 0,
            left: $vuetify.breakpoint.xsOnly
              ? DATAZOOM_Y_SLIDER_LEFT_SMALL
              : DATAZOOM_Y_SLIDER_LEFT,
            filterMode: 'filter',
          },
          {
            type: 'inside',
            // xAxisIndex: [0],
            yAxisIndex: 0,
            filterMode: 'filter',
          },
        ],
      },
    })
    const initOptions = computed(() => {
      return {
        renderer: accessor.chart.renderer,
      }
    })
    const buildChartLegend = () => {
      return {
        data: Object.keys(props.fileData?.metadata?.Curves).slice(1),
      }
    }
    const buildXAxis = () => {
      // First item in data is always DEPTH
      return Object.entries(props.fileData?.data).reduce(
        (prev, curr, currIdx) => {
          if (curr[0] !== 'DEPTH') {
            const xAxis = {
              // Todo: Could we make it toggleable using legend?
              show: true,
              position: 'bottom',
              // Calculates axisLabel offset, adds +25 after every axis
              offset: currIdx - 1 > 0 ? (currIdx - 1) * 25 : 0,
              type: 'value',
              name: curr[0],
              nameLocation: 'end',
              nameTextStyle: {
                fontWeight: 'bold',
              },
              // min(value: any) {
              //   return (value.min - 0.1).toFixed(2) * 1
              // },
              // max(value: any) {
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
            prev.push(xAxis)
          }
          return prev
        },
        [] as any[]
      )
    }

    const buildYAxis = () => {
      return {
        type: 'category',
        boundaryGap: false,
        name: 'DEPTH',
        nameLocation: 'end',
        nameTextStyle: {
          fontWeight: 'bold',
          // fontSize: 14,
          padding: [0, 70, 0, 0],
        },
        nameGap: 10,
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
        data: props.fileData?.data?.DEPTH,
      }
    }

    const buildChartSeries = () => {
      // First item in data is always DEPTH
      return Object.entries(props.fileData?.data).reduce(
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
        [] as any[]
      )
    }
    const chartOptions = computed(() => {
      return {
        animation: false,
        title: {
          text: props.chartTitle,
        },
        legend: buildChartLegend(),
        xAxis: buildXAxis(),
        yAxis: buildYAxis(),
        series: buildChartSeries(),
      }
    })
    state.option = {
      ...state.defaultOptions,
      animation: false,
      title: {
        text: props.chartTitle,
      },
      legend: buildChartLegend(),
      xAxis: buildXAxis(),
      yAxis: buildYAxis(),
      series: buildChartSeries(),
    }
    const updateChartDimensions = (isSmallChart: boolean) => {
      state.defaultOptions = {
        ...state.defaultOptions,
        title: {
          ...state.defaultOptions.title,
          top: isSmallChart ? TITLE_TOP_SMALL : TITLE_TOP,
          textStyle: {
            fontSize: isSmallChart ? TITLE_FONT_SIZE_SMALL : TITLE_FONT_SIZE,
          },
        },
        grid: {
          ...state.defaultOptions.grid,
          left: isSmallChart ? GRID_LEFT_SMALL : GRID_LEFT,
          width: isSmallChart ? GRID_WIDTH_SMALL : GRID_WIDTH,
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            filterMode: 'empty',
          },
          {
            type: 'slider',
            show: true,
            yAxisIndex: 0,
            left: isSmallChart
              ? DATAZOOM_Y_SLIDER_LEFT_SMALL
              : DATAZOOM_Y_SLIDER_LEFT,
            filterMode: 'filter',
          },
          {
            type: 'inside',
            // xAxisIndex: [0],
            yAxisIndex: 0,
            filterMode: 'filter',
          },
        ],
      }
    }
    watch(
      () => $vuetify.breakpoint.xsOnly,
      (newVal) => {
        updateChartDimensions(newVal)
      }
    )
    return {
      ...toRefs(state),
      initOptions,
      chartOptions,
    }
  },
  // data() {
  //   return {
  //     option: {},
  //     defaultOptions: {
  //       // title also gets updated in watcher
  //       title: {
  //         text: 'Chart title',
  //         left: 'center',
  //         top: this.$vuetify.breakpoint.xsOnly ? TITLE_TOP_SMALL : TITLE_TOP,
  //         textStyle: {
  //           fontSize: this.$vuetify.breakpoint.xsOnly
  //             ? TITLE_FONT_SIZE_SMALL
  //             : TITLE_FONT_SIZE,
  //         },
  //       },
  //       // grid also gets updated in watcher
  //       grid: {
  //         show: true,
  //         top: GRID_TOP,
  //         bottom: GRID_BOTTOM,
  //         left: this.$vuetify.breakpoint.xsOnly ? GRID_LEFT_SMALL : GRID_LEFT,
  //         containLabel: true,
  //         width: this.$vuetify.breakpoint.xsOnly
  //           ? GRID_WIDTH_SMALL
  //           : GRID_WIDTH,
  //       },
  //       tooltip: {
  //         trigger: 'axis',
  //         axisPointer: {
  //           type: 'cross',
  //         },
  //         backgroundColor: 'rgba(255, 255, 255, 0.8)',
  //       },
  //       toolbox: {
  //         right: TOOLBOX_RIGHT,
  //         feature: {
  //           saveAsImage: {},
  //           restore: {},
  //           dataView: {},
  //           dataZoom: {},
  //           brush: {
  //             type: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
  //           },
  //         },
  //       },
  //       // dataZoom also gets updated in watcher
  //       dataZoom: [
  //         {
  //           type: 'slider',
  //           show: true,
  //           filterMode: 'empty',
  //         },
  //         {
  //           type: 'slider',
  //           show: true,
  //           yAxisIndex: 0,
  //           left: this.$vuetify.breakpoint.xsOnly
  //             ? DATAZOOM_Y_SLIDER_LEFT_SMALL
  //             : DATAZOOM_Y_SLIDER_LEFT,
  //           filterMode: 'filter',
  //         },
  //         {
  //           type: 'inside',
  //           // xAxisIndex: [0],
  //           yAxisIndex: 0,
  //           filterMode: 'filter',
  //         },
  //       ],
  //     },
  //   }
  // },
  // computed: {
  //   initOptions(): any {
  //     return {
  //       renderer: this.$accessor.chart.renderer,
  //     }
  //   },
  //   chartOptions(): any {
  //     return {
  //       animation: false,
  //       title: {
  //         text: this.chartTitle,
  //       },
  //       legend: this.buildChartLegend(),
  //       xAxis: this.buildXAxis(),
  //       yAxis: this.buildYAxis(),
  //       series: this.buildChartSeries(),
  //     }
  //   },
  // },
  // watch: {
  //   '$vuetify.breakpoint.xsOnly'(newVal) {
  //     this.updateChartDimensions(newVal)
  //   },
  // },
  // created() {
  //   this.option = {
  //     ...this.defaultOptions,
  //     animation: false,
  //     title: {
  //       text: this.chartTitle,
  //     },
  //     legend: this.buildChartLegend(),
  //     xAxis: this.buildXAxis(),
  //     yAxis: this.buildYAxis(),
  //     series: this.buildChartSeries(),
  //   }
  // },
  // methods: {
  //   updateChartDimensions(isSmallChart: any) {
  //     this.defaultOptions = {
  //       ...this.defaultOptions,
  //       title: {
  //         ...this.defaultOptions.title,
  //         top: isSmallChart ? TITLE_TOP_SMALL : TITLE_TOP,
  //         textStyle: {
  //           fontSize: isSmallChart ? TITLE_FONT_SIZE_SMALL : TITLE_FONT_SIZE,
  //         },
  //       },
  //       grid: {
  //         ...this.defaultOptions.grid,
  //         left: isSmallChart ? GRID_LEFT_SMALL : GRID_LEFT,
  //         width: isSmallChart ? GRID_WIDTH_SMALL : GRID_WIDTH,
  //       },
  //       dataZoom: [
  //         {
  //           type: 'slider',
  //           show: true,
  //           filterMode: 'empty',
  //         },
  //         {
  //           type: 'slider',
  //           show: true,
  //           yAxisIndex: 0,
  //           left: isSmallChart
  //             ? DATAZOOM_Y_SLIDER_LEFT_SMALL
  //             : DATAZOOM_Y_SLIDER_LEFT,
  //           filterMode: 'filter',
  //         },
  //         {
  //           type: 'inside',
  //           // xAxisIndex: [0],
  //           yAxisIndex: 0,
  //           filterMode: 'filter',
  //         },
  //       ],
  //     }
  //   },
  //   buildChartLegend() {
  //     return {
  //       data: Object.keys(this.fileData?.metadata?.Curves).slice(1),
  //     }
  //   },
  //   buildXAxis() {
  //     // First item in data is always DEPTH
  //     return Object.entries(this.fileData?.data).reduce(
  //       (prev, curr, currIdx) => {
  //         if (curr[0] !== 'DEPTH') {
  //           const xAxis = {
  //             // Todo: Could we make it toggleable using legend?
  //             show: true,
  //             position: 'bottom',
  //             // Calculates axisLabel offset, adds +25 after every axis
  //             offset: currIdx - 1 > 0 ? (currIdx - 1) * 25 : 0,
  //             type: 'value',
  //             name: curr[0],
  //             nameLocation: 'end',
  //             nameTextStyle: {
  //               fontWeight: 'bold',
  //             },
  //             // min(value: any) {
  //             //   return (value.min - 0.1).toFixed(2) * 1
  //             // },
  //             // max(value: any) {
  //             //   return (value.max + 0.1).toFixed(2) * 1
  //             // },
  //             splitNumber: 2,
  //             axisLine: {
  //               show: true,
  //               symbol: ['none', 'arrow'],
  //               symbolSize: [5, 5],
  //             },
  //             // Todo: Get correct Unit from API (currently metadata omits it)
  //             // axisLabel: {
  //             //   formatter(value) {
  //             //     return `${value} %`
  //             //   },
  //             // },
  //           }
  //           prev.push(xAxis)
  //         }
  //         return prev
  //       },
  //       [] as any[]
  //     )
  //   },

  //   buildYAxis() {
  //     return {
  //       type: 'category',
  //       boundaryGap: false,
  //       name: 'DEPTH',
  //       nameLocation: 'end',
  //       nameTextStyle: {
  //         fontWeight: 'bold',
  //         // fontSize: 14,
  //         padding: [0, 70, 0, 0],
  //       },
  //       nameGap: 10,
  //       splitNumber: 7,
  //       axisTick: {
  //         alignWithLabel: true,
  //       },
  //       // min(value) {
  //       //   return (value.min - 0.1).toFixed(2) * 1
  //       // },
  //       // max(value) {
  //       //   return (value.max + 0.1).toFixed(2) * 1
  //       // },
  //       data: this.fileData?.data?.DEPTH,
  //     }
  //   },

  //   buildChartSeries() {
  //     // First item in data is always DEPTH
  //     return Object.entries(this.fileData?.data).reduce(
  //       (prev, curr, currIdx) => {
  //         if (curr[0] !== 'DEPTH') {
  //           const series = {
  //             name: curr[0],
  //             type: 'line',
  //             xAxisIndex: currIdx - 1,
  //             data: curr[1],
  //             emphasis: {
  //               focus: 'series',
  //             },
  //           }
  //           prev.push(series)
  //         }
  //         return prev
  //       },
  //       [] as any[]
  //     )
  //   },
  // },
})
</script>

<style scoped>
.chart {
  height: 95vh;
  min-height: 600px;
  max-height: 2000px;
}
</style>
