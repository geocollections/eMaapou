<template>
  <client-only>
    <div>
      <div class="d-flex flex-row px-4">
        <v-btn
          width="75"
          small
          class="mb-2 rounded-r-0 rounded-l"
          color="accent"
          :outlined="initOptions.renderer !== 'canvas'"
          @click="initOptions.renderer = 'canvas'"
          >Canvas</v-btn
        >
        <v-btn
          width="75"
          small
          class="mb-2 rounded-l-0 rounded-r"
          color="accent"
          :outlined="initOptions.renderer !== 'svg'"
          @click="initOptions.renderer = 'svg'"
          >SVG</v-btn
        >
      </div>

      <v-chart
        class="chart"
        v-bind="$attrs"
        autoresize
        :init-options="initOptions"
        :option="computedOptions"
        v-on="$listeners"
      />
    </div>
  </client-only>
</template>

<script>
import deepmerge from 'deepmerge'
export default {
  name: 'ChartWrapper',
  props: {
    options: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  data() {
    return {
      initOptions: {
        renderer: 'canvas',
      },
      defaultOptions: {
        title: {
          text: 'Chart title',
          left: 'center',
          top: 45,
          textStyle: {
            fontSize: 24,
          },
        },

        legend: {
          type: 'scroll',
          top: '90',
          padding: [5, 50],
          animationDurationUpdate: 400,
        },

        grid: {
          show: true,
          top: 135,
          bottom: 90,
          left: 100,
          containLabel: true,
          width: 300,
        },

        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        },

        toolbox: {
          right: 35,
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
            left: 475,
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
    }
  },
  computed: {
    computedOptions() {
      // Todo: Keep an eye on options if series or any other option which should/shouldn't exist then errors start showing,
      const deepMergedObject = deepmerge(this.defaultOptions, this.options)
      if (deepMergedObject?.series?.length > 0) return deepMergedObject
      else return {}
    },
  },
}
</script>

<style scoped>
.chart {
  height: 95vh;
  min-height: 600px;
  max-height: 2000px;
}
</style>
