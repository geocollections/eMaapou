<template>
  <client-only>
    <v-chart
      class="chart"
      v-bind="$attrs"
      autoresize
      :option="computedOptions"
      v-on="$listeners"
    />
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
          right: '11%',
          containLabel: true,
        },

        xAxis: {
          type: 'value',
          boundaryGap: false,
          name: 'Depth',
          nameLocation: 'center',
          nameTextStyle: {
            fontWeight: 'bold',
            fontSize: 16,
          },
          nameGap: 25,
          splitNumber: 7,
        },

        tooltip: {
          trigger: 'item',
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
            xAxisIndex: [0],
          },
          {
            type: 'slider',
            show: true,
            yAxisIndex: [0, 1],
            left: '93%',
          },
          {
            type: 'inside',
            xAxisIndex: [0],
          },
        ],
      },
    }
  },
  computed: {
    computedOptions() {
      // Todo: Keep an eye on default options if series is missing then errors start showing,
      const deepMergedObject = deepmerge(this.defaultOptions, this.options)
      if (deepMergedObject?.series?.length > 0) return deepMergedObject
      else return {}
    },
  },
}
</script>

<style scoped>
.chart {
  height: 75vh;
}
</style>
