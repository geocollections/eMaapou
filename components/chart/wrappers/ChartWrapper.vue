<template>
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
</template>

<script>
import deepmerge from 'deepmerge'
import { mapFields } from 'vuex-map-fields'
import RendererSwitch from '~/components/chart/options/RendererSwitch'
import {
  DATAZOOM_Y_SLIDER_LEFT,
  DATAZOOM_Y_SLIDER_LEFT_SMALL,
  GRID_BOTTOM,
  GRID_LEFT,
  GRID_LEFT_SMALL,
  GRID_TOP,
  GRID_WIDTH,
  GRID_WIDTH_SMALL,
  LEGEND_TOP,
  TITLE_FONT_SIZE,
  TITLE_FONT_SIZE_SMALL,
  TITLE_TOP,
  TITLE_TOP_SMALL,
  TOOLBOX_RIGHT,
} from '~/constants'
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
        // title also gets updated in watcher
        title: {
          text: 'Chart title',
          left: 'center',
          top: this.$vuetify.breakpoint.xsOnly ? TITLE_TOP_SMALL : TITLE_TOP,
          textStyle: {
            fontSize: this.$vuetify.breakpoint.xsOnly
              ? TITLE_FONT_SIZE_SMALL
              : TITLE_FONT_SIZE,
          },
        },

        legend: {
          type: 'scroll',
          top: LEGEND_TOP,
          padding: [5, 50],
          animationDurationUpdate: 400,
        },

        // grid also gets updated in watcher
        grid: {
          show: true,
          top: GRID_TOP,
          bottom: GRID_BOTTOM,
          left: this.$vuetify.breakpoint.xsOnly ? GRID_LEFT_SMALL : GRID_LEFT,
          containLabel: true,
          width: this.$vuetify.breakpoint.xsOnly
            ? GRID_WIDTH_SMALL
            : GRID_WIDTH,
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
            left: this.$vuetify.breakpoint.xsOnly
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
  watch: {
    '$vuetify.breakpoint.xsOnly'(newVal) {
      this.updateChartDimensions(newVal)
    },
  },
  methods: {
    updateChartDimensions(isSmallChart) {
      this.defaultOptions = {
        ...this.defaultOptions,
        title: {
          ...this.defaultOptions.title,
          top: isSmallChart ? TITLE_TOP_SMALL : TITLE_TOP,
          textStyle: {
            fontSize: isSmallChart ? TITLE_FONT_SIZE_SMALL : TITLE_FONT_SIZE,
          },
        },
        grid: {
          ...this.defaultOptions.grid,
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
