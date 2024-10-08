<script setup lang="ts">
import deepmerge from "deepmerge";
import { PieChart } from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
} from "echarts/components";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import VChart from "vue-echarts";
import { useDisplay } from "vuetify";
import {
  LEGEND_TOP,
  TITLE_FONT_SIZE,
  TITLE_FONT_SIZE_SMALL,
  TITLE_TOP,
  TITLE_TOP_SMALL,
  TOOLBOX_RIGHT,
} from "~/constants";

const props = defineProps<{
  chartTitle: string;
  taxonData: { name: string; value: number }[];
}>();

use([
  PieChart,
  CanvasRenderer,
  GridComponent,
  TitleComponent,
  LegendComponent,
  ToolboxComponent,
]);

const display = useDisplay();

const defaultOptions = ref({
  title: {
    text: "Chart title",
    left: "center",
    top: display.xs.value ? TITLE_TOP_SMALL : TITLE_TOP,
    textStyle: {
      fontSize: display.xs.value ? TITLE_FONT_SIZE_SMALL : TITLE_FONT_SIZE,
    },
  },
  legend: {
    type: "scroll",
    top: LEGEND_TOP,
    padding: [5, 50],
    animationDurationUpdate: 400,
  },
  toolbox: {
    right: TOOLBOX_RIGHT,
    feature: {
      saveAsImage: {},
      dataView: { readOnly: true },
    },
  },
});

const { renderer } = storeToRefs(useSettings());

const chartOptions = computed(() => {
  return {
    title: {
      text: props.chartTitle,
    },
    legend: {},
    grid: {
      show: false,
    },
    series: buildChartSeries(),
  };
});

const computedOptions = computed(() => {
  const deepMergedObject = deepmerge(defaultOptions.value, chartOptions.value);
  if (deepMergedObject?.series?.length > 0)
    return deepMergedObject;
  else return {};
});

const initOptions = computed(() => {
  return { renderer: renderer.value };
});
function buildChartSeries() {
  return [
    {
      type: "pie",
      radius: "50%",
      itemStyle: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#fff",
      },
      data: props.taxonData,
    },
  ];
}
</script>

<template>
  <div class="pa-2">
    <ClientOnly>
      <VChart
        class="chart"
        v-bind="$attrs"
        autoresize
        :init-options="initOptions"
        :option="computedOptions"
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
