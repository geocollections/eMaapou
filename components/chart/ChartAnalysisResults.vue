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
} from '@nuxtjs/composition-api'
import { GridComponentOption } from 'echarts/components'
import { ComposeOption } from 'echarts/core'
import {
  XAXisComponentOption,
  YAXisComponentOption,
} from 'echarts/types/dist/echarts'
import {
  LegendOption,
  BarSeriesOption,
  TooltipOption,
} from 'echarts/types/dist/shared'

type ECOption = ComposeOption<
  | TooltipOption
  | LegendOption
  | BarSeriesOption
  | XAXisComponentOption
  | YAXisComponentOption
  | GridComponentOption
>

export default defineComponent({
  name: 'ChartAnalysisResults',
  props: {
    data: {
      type: Object as PropType<{
        [K: number | string]: BarSeriesOption['data']
      }>,
      required: true,
    },
  },
  setup(props, context) {
    const initOptions = computed(() => {
      return { renderer: 'canvas' }
    })
    const unitGroup = 1

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
                { gridIndex: i, position: 'top' },
              ] as XAXisComponentOption[],
              yAxis: [
                ...prev.yAxis,
                {
                  gridIndex: i,
                  type: 'category',
                  // @ts-ignore
                  data: group?.map((val) => val.name),
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

    const option = computed((): ECOption => {
      return {
        tooltip: {
          trigger: 'item',
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          // @ts-ignore
          data: Object.values(props.data)[unitGroup]?.map((val) => val.name),
        },
        grid: subCharts.grid,
        xAxis: subCharts.xAxis,
        yAxis: subCharts.yAxis,
        series: subCharts.series,
      }
    })
    onMounted(() => {
      nextTick(() => {
        window.addEventListener('resize', () => {
          // @ts-ignore
          context.refs.chart.resize()
        })
      })
    })
    return { initOptions, option, totalHeight: chartOptions.totalHeight }
  },
})
</script>
