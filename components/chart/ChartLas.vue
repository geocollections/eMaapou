<script setup lang="ts">
import VChart from "vue-echarts";
import {
  AxisPointerComponent,
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
} from "echarts/components";
import { use } from "echarts/core";
import { LineChart } from "echarts/charts";
import { CanvasRenderer, SVGRenderer } from "echarts/renderers";
import { useDisplay } from "vuetify/lib/framework.mjs";
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
} from "~/constants";

const props = defineProps({
  fileData: {
    type: Object,
    required: true,
  },
  chartTitle: {
    type: String,
    required: false,
    default: "Chart title",
  },
  hideRendererSwitch: {
    type: Boolean,
    required: false,
    default: false,
  },
});

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
]);

const display = useDisplay();
const { renderer } = storeToRefs(useSettings());

const state = reactive({
  option: {},
  defaultOptions: {
    // title also gets updated in watcher
    title: {
      text: "Chart title",
      left: "center",
      top: display.xs.value ? TITLE_TOP_SMALL : TITLE_TOP,
      textStyle: {
        fontSize: display.xs.value ? TITLE_FONT_SIZE_SMALL : TITLE_FONT_SIZE,
      },
    },
    // grid also gets updated in watcher
    grid: {
      show: true,
      top: GRID_TOP,
      bottom: GRID_BOTTOM,
      left: display.xs.value ? GRID_LEFT_SMALL : GRID_LEFT,
      containLabel: true,
      width: display.xs.value ? GRID_WIDTH_SMALL : GRID_WIDTH,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
      backgroundColor: "rgba(255, 255, 255, 0.8)",
    },
    toolbox: {
      right: TOOLBOX_RIGHT,
      feature: {
        saveAsImage: {},
        restore: {},
        dataView: {},
        dataZoom: {},
        brush: {
          type: ["rect", "polygon", "lineX", "lineY", "keep", "clear"],
        },
      },
    },
    // dataZoom also gets updated in watcher
    dataZoom: [
      {
        type: "slider",
        show: true,
        filterMode: "empty",
      },
      {
        type: "slider",
        show: true,
        yAxisIndex: 0,
        left: display.xs.value
          ? DATAZOOM_Y_SLIDER_LEFT_SMALL
          : DATAZOOM_Y_SLIDER_LEFT,
        filterMode: "filter",
      },
      {
        type: "inside",
        // xAxisIndex: [0],
        yAxisIndex: 0,
        filterMode: "filter",
      },
    ],
  },
});
const initOptions = computed(() => {
  return {
    renderer: renderer.value,
  };
});
function buildChartLegend() {
  return {
    data: Object.keys(props.fileData?.metadata?.Curves).slice(1),
  };
}
function buildXAxis() {
  // First item in data is always DEPTH
  return Object.entries(props.fileData?.data).reduce((prev, curr, currIdx) => {
    if (curr[0] !== "DEPTH") {
      const xAxis = {
        // Todo: Could we make it toggleable using legend?
        show: true,
        position: "bottom",
        // Calculates axisLabel offset, adds +25 after every axis
        offset: currIdx - 1 > 0 ? (currIdx - 1) * 25 : 0,
        type: "value",
        name: curr[0],
        nameLocation: "end",
        nameTextStyle: {
          fontWeight: "bold",
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
          symbol: ["none", "arrow"],
          symbolSize: [5, 5],
        },
        // Todo: Get correct Unit from API (currently metadata omits it)
        // axisLabel: {
        //   formatter(value) {
        //     return `${value} %`
        //   },
        // },
      };
      prev.push(xAxis);
    }
    return prev;
  }, [] as any[]);
}

function buildYAxis() {
  return {
    type: "category",
    boundaryGap: false,
    name: "DEPTH",
    nameLocation: "end",
    nameTextStyle: {
      fontWeight: "bold",
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
  };
}

function buildChartSeries() {
  // First item in data is always DEPTH
  return Object.entries(props.fileData?.data).reduce((prev, curr, currIdx) => {
    if (curr[0] !== "DEPTH") {
      const series = {
        name: curr[0],
        type: "line",
        xAxisIndex: currIdx - 1,
        data: curr[1],
        emphasis: {
          focus: "series",
        },
      };
      prev.push(series);
    }
    return prev;
  }, [] as any[]);
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
  };
});
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
};
function updateChartDimensions(isSmallChart: boolean) {
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
        type: "slider",
        show: true,
        filterMode: "empty",
      },
      {
        type: "slider",
        show: true,
        yAxisIndex: 0,
        left: isSmallChart
          ? DATAZOOM_Y_SLIDER_LEFT_SMALL
          : DATAZOOM_Y_SLIDER_LEFT,
        filterMode: "filter",
      },
      {
        type: "inside",
        // xAxisIndex: [0],
        yAxisIndex: 0,
        filterMode: "filter",
      },
    ],
  };
}
watch(
  () => display.xs.value,
  (newVal) => {
    updateChartDimensions(newVal);
  },
);
</script>

<template>
  <div>
    <RendererSwitch
      v-if="!hideRendererSwitch"
      :renderer="renderer"
      @update="renderer = $event"
    />
    <ClientOnly>
      <VChart
        class="chart"
        autoresize
        :init-options="initOptions"
        :option="state.option"
      />
    </ClientOnly>
  </div>
</template>

<style scoped>
.chart {
  height: 95vh;
  min-height: 600px;
  max-height: 2000px;
}
</style>
