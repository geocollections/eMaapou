<template>
  <div>
    <client-only>
      <v-chart
        id="chart-analysis-results"
        ref="chart"
        :style="`height: ${totalHeight}px; width: 100%`"
        :init-options="initOptions"
        :option="option"
      />
    </client-only>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  PropType,
  reactive,
  ref,
} from '@nuxtjs/composition-api'
import { BarChart } from 'echarts/charts'
import {
  GridComponent,
  GridComponentOption,
  TooltipComponent,
} from 'echarts/components'
import { ComposeOption, use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import {
  XAXisComponentOption,
  YAXisComponentOption,
} from 'echarts/types/dist/echarts'
import VChart from 'vue-echarts'
import { BarSeriesOption, TooltipOption } from 'echarts/types/dist/shared'

type ECOption = ComposeOption<
  | TooltipOption
  | BarSeriesOption
  | XAXisComponentOption
  | YAXisComponentOption
  | GridComponentOption
>
use([CanvasRenderer, BarChart, GridComponent, TooltipComponent])
export default defineComponent({
  name: 'ChartAnalysisResults',
  components: { VChart },
  props: {
    data: {
      type: Object as PropType<{
        [K: number]: BarSeriesOption['data']
      }>,
      required: true,
    },
  },
  setup(props) {
    const chart = ref<typeof VChart>()
    const initOptions = computed(() => {
      return { renderer: 'canvas' as 'canvas' | 'svg' }
    })

    const createSubCharts = (data: typeof props['data']) => {
      let topPosition = 20
      let totalHeight = 60
      return {
        subCharts: Object.values(data).reduce(
          (
            prev,
            group,
            i
          ): {
            grid: GridComponentOption[]
            xAxis: XAXisComponentOption[]
            yAxis: YAXisComponentOption[]
            series: BarSeriesOption[]
          } => {
            const height = 20 * (group?.length ?? 0)
            const result = {
              ...prev,
              grid: [
                ...prev.grid,
                {
                  id: `analysis-result-grid-${i}`,
                  height,
                  top: topPosition + 40 * i,
                  left: '15%',
                },
              ] as GridComponentOption[],
              xAxis: [
                ...prev.xAxis,
                {
                  gridIndex: i,
                  id: `x-axis-${i}`,
                  position: 'top',
                },
              ] as XAXisComponentOption[],
              yAxis: [
                ...prev.yAxis,
                {
                  gridIndex: i,
                  id: `y-axis-${i}`,
                  type: 'category',
                  axisLabel: {
                    width: chart.value
                      ? (chart.value?.$el as Element).clientWidth * 0.12
                      : 50,
                    overflow: 'truncate',
                  },
                  data: group?.map((val) => ({
                    // @ts-ignore
                    value: val.name,
                  })),

                  axisPointer: {
                    show: true,
                    type: 'shadow',
                  },
                },
              ] as YAXisComponentOption[],
              series: [
                ...prev.series,
                {
                  type: 'bar',
                  id: `series-${i}`,
                  data: group,
                  xAxisIndex: i,
                  yAxisIndex: i,
                },
              ] as BarSeriesOption[],
            }
            topPosition += height
            totalHeight += height + 40 * i
            return result
          },
          {
            grid: [] as GridComponentOption[],
            xAxis: [] as XAXisComponentOption[],
            yAxis: [] as YAXisComponentOption[],
            series: [] as BarSeriesOption[],
          }
        ),
        chartOptions: { totalHeight },
      }
    }
    const { subCharts, chartOptions } = createSubCharts(props.data)
    const state = reactive({
      subCharts,
      chartOptions,
    })
    const option = computed((): ECOption => {
      return {
        tooltip: {
          trigger: 'item',
        },
        grid: state.subCharts.grid,
        xAxis: state.subCharts.xAxis,
        yAxis: state.subCharts.yAxis,
        series: state.subCharts.series,
      }
    })
    onMounted(() => {
      nextTick(() => {
        window.addEventListener('resize', () => {
          const { subCharts } = createSubCharts(props.data)
          state.subCharts = subCharts
          chart.value?.resize()
        })
        window.dispatchEvent(new Event('resize'))
      })
    })
    return { initOptions, option, totalHeight: chartOptions.totalHeight, chart }
  },
})
</script>
