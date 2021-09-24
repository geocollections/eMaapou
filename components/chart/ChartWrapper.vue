<template>
  <client-only>
    <div>
      <renderer-switch
        v-if="!hideRendererSwitch"
        :renderer="renderer"
        @update="renderer = $event"
      />

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
import { mapFields } from 'vuex-map-fields'
import RendererSwitch from '~/components/chart/RendererSwitch'
export default {
  name: 'ChartWrapper',
  components: { RendererSwitch },
  props: {
    options: {
      type: Object,
      required: false,
      default: () => {},
    },
    hideRendererSwitch: {
      type: Boolean,
      required: false,
      default: false,
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
    ...mapFields('chart', ['renderer']),
    computedOptions() {
      // Todo: Keep an eye on options if series or any other option which should/shouldn't exist then errors start showing,
      const deepMergedObject = deepmerge(this.defaultOptions, this.options)
      if (deepMergedObject?.series?.length > 0) return deepMergedObject
      else return {}
    },

    initOptions() {
      return {
        renderer: this.renderer,
      }
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
