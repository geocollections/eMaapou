<script setup lang="ts">
import { BarChart } from "echarts/charts";
import {
  GridComponent,
  type GridComponentOption,
  TooltipComponent,
} from "echarts/components";
import { type ComposeOption, use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import type {
  XAXisComponentOption,
  YAXisComponentOption,
} from "echarts/types/dist/echarts.js";
import VChart from "vue-echarts";
import type { BarSeriesOption, TooltipOption } from "echarts/types/dist/shared.js";

type ECOption = ComposeOption<
  | TooltipOption
  | BarSeriesOption
  | XAXisComponentOption
  | YAXisComponentOption
  | GridComponentOption
>;
const props = defineProps({
  data: {
    type: Object as PropType<{
      [K: number]: BarSeriesOption["data"];
    }>,
    required: true,
  },
});

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent]);

const chart = ref<typeof VChart>();
const initOptions = computed(() => {
  return { renderer: "canvas" as "canvas" | "svg" };
});

function createSubCharts(data: (typeof props)["data"]) {
  let topPosition = 20;
  let totalHeight = 60;
  return {
    subCharts: Object.values(data).reduce(
      (
        prev,
        group,
        i,
      ): {
        grid: GridComponentOption[];
        xAxis: XAXisComponentOption[];
        yAxis: YAXisComponentOption[];
        series: BarSeriesOption[];
      } => {
        const height = 20 * (group?.length ?? 0);
        const result = {
          ...prev,
          grid: [
            ...prev.grid,
            {
              id: `analysis-result-grid-${i}`,
              height,
              top: topPosition + 40 * i,
              left: "15%",
            },
          ] as GridComponentOption[],
          xAxis: [
            ...prev.xAxis,
            {
              gridIndex: i,
              id: `x-axis-${i}`,
              position: "top",
            },
          ] as XAXisComponentOption[],
          yAxis: [
            ...prev.yAxis,
            {
              gridIndex: i,
              id: `y-axis-${i}`,
              type: "category",
              axisLabel: {
                width: chart.value
                  ? (chart.value?.$el as Element).clientWidth * 0.12
                  : 50,
                overflow: "truncate",
              },
              data: group?.map(val => ({
                // @ts-expect-error - ???
                value: val.name,
              })),

              axisPointer: {
                show: true,
                type: "shadow",
              },
            },
          ] as YAXisComponentOption[],
          series: [
            ...prev.series,
            {
              type: "bar",
              id: `series-${i}`,
              data: group,
              xAxisIndex: i,
              yAxisIndex: i,
            },
          ] as BarSeriesOption[],
        };
        topPosition += height;
        totalHeight += height + 40 * i;
        return result;
      },
      {
        grid: [] as GridComponentOption[],
        xAxis: [] as XAXisComponentOption[],
        yAxis: [] as YAXisComponentOption[],
        series: [] as BarSeriesOption[],
      },
    ),
    chartOptions: { totalHeight },
  };
}
const { subCharts, chartOptions } = createSubCharts(props.data);
const state = reactive({
  subCharts,
  chartOptions,
});
const option = computed((): ECOption => {
  return {
    tooltip: {
      trigger: "item",
    },
    grid: state.subCharts.grid as GridComponentOption[],
    xAxis: state.subCharts.xAxis as XAXisComponentOption[],
    yAxis: state.subCharts.yAxis as YAXisComponentOption[],
    series: state.subCharts.series as BarSeriesOption[],
  };
});
onMounted(() => {
  nextTick(() => {
    window.addEventListener("resize", () => {
      const { subCharts } = createSubCharts(props.data);
      state.subCharts = subCharts;
      chart.value?.resize();
    });
    window.dispatchEvent(new Event("resize"));
  });
});
</script>

<template>
  <div>
    <ClientOnly>
      <VChart
        id="chart-analysis-results"
        ref="chart"
        :style="`height: ${state.chartOptions.totalHeight}px `"
        :init-options="initOptions"
        :option="option"
      />
    </ClientOnly>
  </div>
</template>
