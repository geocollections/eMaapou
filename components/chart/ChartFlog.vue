<script setup lang="ts">
import { mdiCog, mdiRefresh } from "@mdi/js";
import groupBy from "lodash/groupBy";
import orderBy from "lodash/orderBy";
import differenceBy from "lodash/differenceBy";
import type {
  AxisPointerComponentOption,
  DataZoomComponentOption,
  GridComponentOption,
  TitleComponentOption,
  TooltipComponentOption,
} from "echarts/components";
import {
  AxisPointerComponent,
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
} from "echarts/components";
import type {
  XAXisComponentOption,
  YAXisComponentOption,
} from "echarts/types/dist/echarts";
import type { CustomSeriesOption, LineSeriesOption } from "echarts/charts";
import { CustomChart, LineChart } from "echarts/charts";
import VChart from "vue-echarts";
import type { ComposeOption } from "echarts/core";
import { use } from "echarts/core";
import { CanvasRenderer, SVGRenderer } from "echarts/renderers";
import type { TitleOption } from "echarts/types/dist/shared";
import { useTheme } from "vuetify/lib/framework.mjs";
import range from "~/utils/range";
import clipRectByRect from "~/utils/clipRectByRect";
import mm2px from "~/utils/mm2px";
import px2mm from "~/utils/px2mm";
import type { IFlogMethod, IFlogParameter } from "~/utils/flogParameters";
import type { Renderer } from "~/types/enums";

type ECOption = ComposeOption<
  | GridComponentOption
  | LineSeriesOption
  | CustomSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | DataZoomComponentOption
  | AxisPointerComponentOption
>;
interface GroupedParameter {
  id: number;
  value: number;
  name: string;
  count: number;
  methods: any[];
}
const props = defineProps({
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
});

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
]);

interface ChartComponents {
  grid: GridComponentOption;
  xAxis: XAXisComponentOption;
  yAxis: YAXisComponentOption;
  series: LineSeriesOption[];
}

const { $translate } = useNuxtApp();
const theme = useTheme();
const { t } = useI18n();
const localeRoute = useLocaleRoute();
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
  scale: Number.parseFloat(
    (((props.maxDepth - props.minDepth) * 1000) / px2mm(618)).toFixed(0),
  ),
  currentScale: Number.parseFloat(
    (((props.maxDepth - props.minDepth) * 1000) / px2mm(618)).toFixed(0),
  ),
  option: {},
  nextGridIndex: 4,
  replace: true,
});

const { renderer, ppi } = storeToRefs(useSettings());
const containerFlogChart = ref<HTMLElement>();
const flogChart = ref<typeof VChart>();

const icons = computed(() => {
  return {
    mdiCog,
    mdiRefresh,
  };
});
const initOptions = computed(() => {
  return {
    renderer: renderer.value,
  };
});
const updateOptions = computed(() => {
  if (state.replace) {
    return {
      notMerge: false,
      replaceMerge: ["xAxis", "yAxis", "series", "grid"],
    };
  }
  return {
    notMerge: false,
  };
});
const titleSubtext = computed(() => {
  return t("flogChart.titleSubtext", {
    scale: state.currentScale,
    minDepth: state.currentMaxDepth.toFixed(2),
    maxDepth: state.currentMinDepth.toFixed(2),
  }).toString();
});
const chartTitle = computed((): TitleOption => {
  return {
    id: "main-title",
    text: props.title,
    left: 60,
    subtext: titleSubtext.value,
  };
});
const methods = computed(() => {
  return props.parameters.reduce((prev, method) => {
    prev[method.value] = method;
    return prev;
  }, {} as { [K: string]: IFlogMethod });
});
const selectedParametersGrouped = computed(() => {
  return groupParameters(state.selectedParameters);
});
function calculateScale(
  maxDepth: number,
  minDepth: number,
  chartHeight: number,
) {
  return ((maxDepth - minDepth) * 1000) / px2mm(chartHeight);
}
function calculateTotalWidth() {
  const parameterModuleWidth
    = selectedParametersGrouped.value.length
    * (state.parameterChartWidth + state.parameterChartPadding)
    + state.parameterModulePadding;

  const totalWidth
    = state.sampleChartWidth
    + state.sampleChartPaddingLeft
    + parameterModuleWidth;

  if (containerFlogChart.value) {
    return containerFlogChart.value.clientWidth
      && containerFlogChart.value.clientWidth > totalWidth
      ? containerFlogChart.value.clientWidth
      : totalWidth;
  }

  return totalWidth;
}
function scaleChartHeight() {
  return (
    mm2px(
      (state.currentMaxDepth - state.currentMinDepth) * 1000 * (1 / state.scale),
    )
    * (ppi.value / 96)
  );
}
const router = useRouter();

function handleClick(event: any) {
  // TODO: `any` should be replaced with the correct event type from echarts
  if (event.seriesId === "samples-series") {
    const sampleId = event.data[3];
    if (sampleId) {
      window.open(
        router.resolve(
          localeRoute({ name: "sample-id", params: { id: sampleId } }),
        ).href,
        "_blank",
        "height=800,width=800",
      );
    }
  }
}
function handleDataZoom() {
  const datazoom = flogChart.value?.getOption().dataZoom[0];
  state.currentMinDepth = datazoom.startValue;
  state.currentMaxDepth = datazoom.endValue;
  state.currentScale = calculateScale(
    state.currentMaxDepth,
    state.currentMinDepth,
    state.currentHeight,
  );

  state.replace = false;
  state.option = {
    title: {
      id: chartTitle.value.id,
      subtext: chartTitle.value.subtext,
    },
  };
}
function groupParameters(parameters: any[]): GroupedParameter[] {
  const grouped = groupBy(parameters, "value");
  return orderBy(
    Object.entries(grouped).map(([paramId, params]) => {
      return {
        id: params[0].id,
        value: Number.parseInt(paramId),
        name: params[0].name,
        count: params[0].count,
        methods: grouped[paramId].map(p => p.methodValue),
      };
    }),
    ["id"],
    ["asc"],
  );
}
function handleRenderSwitch(newRenderer: Renderer) {
  renderer.value = newRenderer;
  state.replace = true;
  state.option = flogChart.value?.getOption();
}
function handlePpiChange(newPpi: string) {
  ppi.value = Number.parseInt(newPpi);
  state.currentScale = state.scale;
  state.currentHeight = scaleChartHeight();
  state.replace = false;
  state.option = {
    grid: flogChart.value?.getOption().grid.map((grid: GridComponentOption) => {
      return { id: grid.id, height: state.currentHeight };
    }),
    title: chartTitle.value,
  };
}
function handleParametersUpdate(newSelectedParameters: any[]) {
  const chart = flogChart.value;

  const addedParameters = newSelectedParameters.filter((newParam) => {
    return !state.selectedParameters.some(param => param.id === newParam.id);
  });
  const removedParameters = state.selectedParameters.filter((newParam) => {
    return !newSelectedParameters.some(param => param.id === newParam.id);
  });
  const oldGroupedParameters = groupParameters(state.selectedParameters);

  state.selectedParameters = newSelectedParameters;

  const groupedParameters = groupParameters(state.selectedParameters);

  state.totalWidth = calculateTotalWidth();

  if (addedParameters.length > 0) {
    const newDataZoomYAxisIndices = chart?.getOption().dataZoom[0].yAxisIndex;

    let parameterGridIndex = 0;
    let fromIndex = 0;
    let parameterGridPosition = 0;

    const groupedNewParameters = groupBy(newSelectedParameters, "value");
    const newOptions = addedParameters.reduce(
      (prev, addedParameter) => {
        // if the `addedParameter` already has a chart, i.e. same parameter, different method. Update the series data.
        if (groupedNewParameters[addedParameter.value].length > 1) {
          const series = chart
            ?.getOption()
            .series.find((series: LineSeriesOption) =>
              (series.id as string)?.endsWith(`-${addedParameter.value}`),
            );
          const newChartComponents = createParameterChartComponents(
            groupedParameters.find((param: any) => {
              return param.value === addedParameter.value;
            }) as GroupedParameter,
            series.xAxisIndex,
            -1,
            { returnComponents: ["series"] },
          );
          prev.series.push(...newChartComponents.series);
          return prev;
        }

        const nullGridIndex = chart?.getOption().grid.indexOf(null, fromIndex);
        // if empty spot in echarts grid list, use the empty spot index as `gridIndex`, as echarts wants these empty spaces to be filled
        if (nullGridIndex > -1) {
          state.nextGridIndex = nullGridIndex;
          fromIndex = nullGridIndex + 1;
        }
        else {
          state.nextGridIndex
            = chart?.getOption().grid.length + parameterGridIndex;
          parameterGridIndex += 1;
        }

        newDataZoomYAxisIndices.push(state.nextGridIndex);
        const newChartComponents = createParameterChartComponents(
          groupedParameters.find((param: any) => {
            return param.value === addedParameter.value;
          }) as GroupedParameter,
          state.nextGridIndex,
          oldGroupedParameters.length + parameterGridPosition,
        );

        parameterGridPosition += 1;

        prev.grid.push(newChartComponents.grid);
        prev.xAxis.push(newChartComponents.xAxis);
        prev.yAxis.push(newChartComponents.yAxis);
        prev.series.push(...newChartComponents.series);
        return prev;
      },
      { grid: [], xAxis: [], yAxis: [], series: [] },
    );
    state.replace = false;
    newOptions.dataZoom = {
      id: chart?.getOption().dataZoom[0].id,
      yAxisIndex: newDataZoomYAxisIndices,
    };
    state.option = newOptions;
  }
  else {
    const removed = differenceBy(
      oldGroupedParameters,
      groupedParameters,
      "value",
    );
    const modified = differenceBy(removedParameters, removed, "value");

    const currentOption = chart?.getOption();
    const gridsOrdered = orderBy(currentOption.grid, ["left"], ["asc"]);
    let position = 0;

    const newOptions = gridsOrdered.reduce(
      (prev, grid, i) => {
        if (grid == null)
          return prev;

        if (!grid.id.startsWith("parameter")) {
          // !!! using `i` is not correct as the grids have been reordered
          // this should not cause any problems right now but, could when other chart tpyes are added (taxon, stratigraphy) or when samples chart can be disabled
          prev.grid.push({ id: grid.id });
          prev.xAxis.push({ id: currentOption.xAxis[i].id });
          prev.yAxis.push({ id: currentOption.yAxis[i].id });
          prev.series.push({ id: currentOption.series[i].id });
          return prev;
        }
        const parameterValueStr = grid.id.split("-")[2];
        const parameterValue = Number.parseInt(parameterValueStr);

        const xAxis = currentOption.xAxis.find((xAxis: XAXisComponentOption) =>
          (xAxis?.id as string)?.endsWith(`-${parameterValueStr}`),
        );
        const yAxis = currentOption.yAxis.find((yAxis: YAXisComponentOption) =>
          (yAxis?.id as string)?.endsWith(`-${parameterValueStr}`),
        );
        const series = currentOption.series.filter((series: LineSeriesOption) =>
          (series?.id as string)?.endsWith(`-${parameterValueStr}`),
        );

        // if one of the parameter methods removed but some method, for that parameter, still selected,
        // update series data and grid position
        if (modified.some(m => m.value === parameterValue)) {
          const param = groupedParameters.find(
            m => m.value === parameterValue,
          ) as GroupedParameter;
          const newChartComponents = createParameterChartComponents(
            param,
            xAxis.gridIndex,
            position,
            { returnComponents: ["series", "grid"] },
          );
          position += 1;

          prev.grid.push({
            id: grid.id,
            left: newChartComponents.grid?.left,
          });
          prev.xAxis.push({ id: xAxis.id });
          prev.yAxis.push({ id: yAxis.id });
          prev.series.push(...newChartComponents.series);
          return prev;
        }
        // if chart is not modified or removed, leave it as is, only update grid position.
        if (!removed.some(m => m.value === parameterValue)) {
          const param = groupedParameters.find(
            m => m.value === parameterValue,
          ) as GroupedParameter;
          const newChartComponents = createParameterChartComponents(
            param,
            -1,
            position,
            { returnComponents: ["grid"] },
          );
          position += 1;
          prev.grid.push({
            id: grid.id,
            left: newChartComponents.grid?.left,
          });
          prev.xAxis.push({ id: xAxis.id });
          prev.yAxis.push({ id: yAxis.id });
          prev.series.push(...series);
          return prev;
        }
        return prev;
      },
      { grid: [], xAxis: [], yAxis: [], series: [] },
    );
    state.replace = true;
    state.option = newOptions;
  }
}
function handleScaleReset() {
  state.scale = calculateScale(
    props.maxDepth,
    props.minDepth,
    state.initialHeight,
  );
  state.currentScale = state.scale;
  ppi.value = 96;
  state.currentHeight = state.initialHeight;

  state.replace = false;
  state.option = {
    grid: flogChart.value?.getOption().grid.map((grid: GridComponentOption) => {
      return { id: grid.id, height: state.currentHeight };
    }),
    title: chartTitle.value,
  };
}
function handleScaleChange() {
  state.currentScale = state.scale;
  state.currentHeight = scaleChartHeight();

  state.replace = false;
  state.option = {
    grid: flogChart.value?.getOption().grid.map((grid: GridComponentOption) => {
      return { id: grid.id, height: state.currentHeight };
    }),
    title: chartTitle.value,
  };
}
function handleParameterChartWidthChange(newParameterChartWidth: string) {
  state.parameterChartWidth = Number.parseInt(newParameterChartWidth);

  state.totalWidth = calculateTotalWidth();
  state.replace = false;
  state.option = {
    grid: flogChart.value
      ?.getOption()
      .grid.map((grid: GridComponentOption, i: number) => {
        if (!(grid.id as string)?.startsWith("parameter"))
          return { id: grid.id };

        return {
          id: grid.id,
          width: state.parameterChartWidth,
          left: calcParameterChartLeft(i - 1),
        };
      }),
    title: chartTitle.value,
  };
}
function calcParameterChartLeft(position: number) {
  return (
    state.sampleChartWidth
    + state.sampleChartPaddingLeft
    + position * (state.parameterChartWidth + state.parameterChartPadding)
    + state.parameterModulePadding
  );
}
function createParameterChartComponents<
  T extends ChartComponents,
  K extends keyof T,
>(
  param: {
    id: any;
    value: number;
    name: any;
    count: any;
    methods: any[];
  },
  index: number,
  position: number,
  { returnComponents }: { returnComponents: K[] } = {
    returnComponents: ["grid", "xAxis", "yAxis", "series"] as K[],
  },
): Pick<T, K> {
  const result = Object.assign(
    {},
    ...returnComponents.map(key => ({ [key]: null })),
  );

  if (returnComponents.includes("grid" as K)) {
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
        trigger: "item",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
      },
    };
  }
  if (returnComponents.includes("xAxis" as K)) {
    result.xAxis = {
      id: `parameter-x-axis-${param.value}`,
      show: true,
      position: "top",
      type: "value",
      name: param.name,
      nameLocation: "middle",
      nameTextStyle: {
        fontWeight: "bold",
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
    };
  }
  if (returnComponents.includes("yAxis" as K)) {
    result.yAxis = {
      id: `parameter-y-axis-${param.value}`,
      type: "value",
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
    };
  }
  if (returnComponents.includes("series" as K)) {
    result.series = param.methods.map((method): LineSeriesOption => {
      return {
        id: `parameter-series-${method}-${param.value}`,
        name: `(${$translate({
          et: methods.value[method].name,
          en: methods.value[method].name_en,
        })}) ${param.name}`,
        type: "line",
        smooth: false,
        xAxisIndex: index,
        yAxisIndex: index,
        lineStyle: {
          width: 1,
        },
        tooltip: {
          formatter(params: any) {
            // @ts-expect-error
            const data: [number, number, number, number, string] = params.data;
            return `
                <span class="mr-2" style="display: inline-block; width: 10px; height: 10px; border-radius: 10px; background-color: ${
                  params.color
                }"></span>
                <span>
                  ${data[4]}<br />
                  ${params.seriesName}: <b>${data[0]}</b><br />
                  Depth: <b>${data[2]}</b>
                  ${data[3] ? `<br />Depth interval: <b>${data[3]}</b>` : ""}
                </span>
                `;
          },
        },
        data: props.analyses
          .filter(
            (result: any) =>
              result.parameter === param.name && method === result.method_id,
          )
          .map((t) => {
            const avgDepth = t.depth_interval
              ? (t.depth + t.depth_interval) / 2
              : t.depth;
            return [
              t.value,
              props.reverse ? -avgDepth : avgDepth,
              props.reverse ? -t.depth : t.depth,
              props.reverse ? -t.depth_interval : t.depth_interval,
              t.analysis_id,
            ];
          })
          .sort((a, b) => a[1] - b[1]),
        emphasis: {
          focus: "series",
        },
      };
    });
  }
  return result;
}
function createOption(): ECOption {
  const selectedParameterChartComponents = groupParameters(
    state.selectedParameters,
  ).reduce(
    (prev, parameter, i) => {
      const parameterComponents = createParameterChartComponents(
        parameter,
        i + 1,
        i,
      );
      prev.grid.push(parameterComponents.grid);
      prev.xAxis.push(parameterComponents.xAxis);
      prev.yAxis.push(parameterComponents.yAxis);
      prev.series.push(...parameterComponents.series);
      return prev;
    },
    { grid: [], xAxis: [], yAxis: [], series: [] } as {
      grid: GridComponentOption[];
      xAxis: XAXisComponentOption[];
      yAxis: YAXisComponentOption[];
      series: LineSeriesOption[];
    },
  );

  return {
    animation: false,
    title: chartTitle.value,
    tooltip: {
      trigger: "item",
    },
    legend: {
      bottom: "20",
      left: "center",
    },
    dataZoom: [
      {
        id: "dataZoom-y-inside",
        type: "inside",
        yAxisIndex: range(1 + state.selectedParameters.length),
        filterMode: "none",
        minValueSpan: 0.1,
      },
      {
        id: "dataZoom-y-slider",
        type: "slider",
        yAxisIndex: 0,
        realtime: false,
        minValueSpan: 0.1,
        width: 20,
        left: 10,
      },
    ],
    toolbox: {
      orient: "vertical",
      left: "left",
      feature: {
        dataZoom: {
          yAxisIndex: "none",
          xAxisIndex: "all",
          filterMode: "none",
        },
        saveAsImage: {
          excludeComponents: ["toolbox", "dataZoom"],
        },
      },
    },
    axisPointer: [
      {
        link: [{ yAxisIndex: "all" }],
        triggerTooltip: false,
        label: {
          fontSize: 10,
          backgroundColor: theme.current.value.colors.warning as string,
        },
        lineStyle: {
          color: theme.current.value.colors.warning as string,
          width: 1,
        },
      },
    ],
    grid: [
      {
        id: "samples-grid",
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
        id: "samples-x-axis",
        type: "category",
        data: [t("flogChart.samples") as string],
        position: "top",
        axisLabel: {
          fontWeight: "bold",
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
        id: "samples-y-axis",
        show: true,
        type: "value",
        name: t("common.depth") as string,
        nameLocation: "middle",
        nameGap: 40,
        nameTextStyle: {
          fontWeight: "bold",
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
        id: "samples-series",
        type: "custom",
        name: t("flogChart.samples") as string,
        xAxisIndex: 0,
        yAxisIndex: 0,
        tooltip: {
          position: "bottom",
          formatter(params: any) {
            // @ts-expect-error
            const data: [number, number, number, number, string] = params.data;

            return `
              <span class="mr-2" style="display: inline-block; width: 10px; height: 10px; border-radius: 10px; background-color: ${
                params.color
              }"></span>
              <span>
                ${data[4]}<br />
                Depth: <b>${data[1]}</b><br />
                ${data[2] ? `Depth interval: <b>${data[2]}</b>` : ""}
              </span>
              `;
          },
        },
        labelLayout: {
          hideOverlap: false,
        },
        label: {
          show: true,
          position: "right",
          color: "black",
          fontSize: 12,
          // @ts-expect-error
          formatter: "{@[4]}",
        },
        renderItem(params, api) {
          const categoryIndex = api.value(0);
          const depthInterval = api.value(2)
            ? api.value(2)
            : (api.value(1) as number) - 0.1;
          const switchDepths = api.value(1) < depthInterval;
          const startDepth = switchDepths ? depthInterval : api.value(1);
          const endDepth = switchDepths ? api.value(1) : depthInterval;
          const start = api.coord([categoryIndex, startDepth]);
          const end = api.coord([categoryIndex, endDepth]);

          const categoryWidth = api.size
            ? (api.size([0, 1]) as number[])[0]
            : 0;
          const dynamicHeight = end[1] - start[1];
          const height
            = api.value(2) || dynamicHeight < 10 ? dynamicHeight : 10;
          const x = start[0] - categoryWidth * 0.5;
          const y = api.value(2) ? start[1] : start[1] - height / 2;
          const rectShape = clipRectByRect(
            {
              x,
              y,
              width: 10,
              height,
            },
            {
              // @ts-expect-error
              x: params.coordSys.x,
              // @ts-expect-error
              y: params.coordSys.y,
              // @ts-expect-error
              width: params.coordSys.width,
              // @ts-expect-error
              height: params.coordSys.height,
            },
          );
          return (
            rectShape && {
              type: "rect",
              transition: [],
              shape: rectShape,
              style: { ...api.style(), fill: "#000000" },
              emphasis: {
                style: api.style(),
              },
            }
          );
        },
        data: props.samples.map((item: any) => {
          return [
            0,
            props.reverse ? -item.depth : item.depth,
            props.reverse ? -item.depth_interval : item.depth_interval,
            item.id,
            item.sample_number || item.sample_id,
          ];
        }),
      },
      ...selectedParameterChartComponents.series,
    ],
  };
}
// Set initial selected parameters
if (props.parameters.length > 0) {
  state.selectedParameters = props.parameters[0].children.slice(
    0,
    props.parameters[0].children.length > 3
      ? 3
      : props.parameters[0].children.length,
  );
}
state.totalWidth = calculateTotalWidth();
state.option = createOption();
</script>

<template>
  <div class="">
    <VToolbar
      flat
      color="white"
      density="compact"
    >
      <OptionsParameterTreeView
        :parameters="parameters"
        :initial-selection="state.selectedParameters"
        @input="handleParametersUpdate"
      />
      <VMenu
        transition="slide-y-transition"
        offset="10"
        content-class="white"
        :close-on-content-click="false"
      >
        <template #activator="{ props }">
          <VBtn
            class="ml-3"
            icon
            size="small"
            v-bind="props"
          >
            <VIcon> {{ icons.mdiCog }} </VIcon>
          </VBtn>
        </template>
        <VCard>
          <VCardTitle class="montserrat pb-2">
            {{ $t("flogChart.settings") }}
          </VCardTitle>
          <VCardText>
            <RendererSwitch
              :renderer="renderer"
              @update="handleRenderSwitch"
            />
            <VDivider class="my-2" />
            <VTextField
              v-model="state.scale"
              type="number"
              :label="$t('flogChart.heightScale')"
              prefix="1:"
              variant="underlined"
              hide-details
              @change="handleScaleChange"
            >
              <template #append-inner>
                <VIcon @click="handleScaleReset">
                  {{ icons.mdiRefresh }}
                </VIcon>
              </template>
              <template #append>
                <VBtnToggle
                  density="compact"
                  color="accent"
                  :model-value="ppi"
                  @update:model-value="handlePpiChange"
                >
                  <VBtn
                    width="65"
                    size="small"
                    class="text-none montserrat"
                    :variant="ppi !== 96 && 'outlined'"
                    :value="96"
                  >
                    96 PPI
                  </VBtn>
                  <VBtn
                    width="65"
                    size="small"
                    class="text-none montserrat"
                    :variant="ppi !== 72 && 'outlined'"
                    :value="72"
                  >
                    72 PPI
                  </VBtn>
                </VBtnToggle>
              </template>
            </VTextField>
            <VTextField
              :model-value="state.parameterChartWidth"
              type="number"
              class="d-inline-flex"
              variant="underlined"
              hide-details
              suffix="px"
              :label="$t('flogChart.parameterChartWidth')"
              @change="handleParameterChartWidthChange"
            />
          </VCardText>
        </VCard>
      </VMenu>
    </VToolbar>
    <VDivider />
    <div ref="containerFlogChart" class="overflow-x-auto">
      <ClientOnly>
        <VChart
          ref="flogChart"
          class="chart pa-2"
          :style="{
            width: `${state.totalWidth}px`,
            height: `${state.currentHeight + 200}px`,
          }"
          v-bind="$attrs"
          autoresize
          :init-options="initOptions"
          :option="state.option"
          :update-options="updateOptions"
          @click="handleClick"
          @datazoom="handleDataZoom"
        />
        <template #placeholder>
          <div
            :style="`height: ${state.initialHeight + 200}px; width: 100%`"
            class="d-flex align-center justify-center"
          >
            <VProgressCircular
              indeterminate
              color="accent"
              :size="100"
              :width="6"
            />
          </div>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<style scoped>
:deep(.v-input__append-inner) {
  align-self: flex-end !important;
}
</style>
