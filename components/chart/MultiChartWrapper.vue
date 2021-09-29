<template>
  <client-only>
    <div>
      <renderer-switch
        v-show="!hideRendererSwitch"
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
  name: 'MultiChartWrapper',
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
        },

        // grid also gets updated in watcher
        grid: {
          show: true,
          top: 50,
          left: '20px',
          containLabel: true,
          width: '200px',
        },

        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        },

        // toolbox: {
        //   right: TOOLBOX_RIGHT,
        //   feature: {
        //     saveAsImage: {},
        //     restore: {},
        //     dataView: {},
        //     dataZoom: {},
        //     brush: {
        //       type: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
        //     },
        //   },
        // },

        // dataZoom also gets updated in watcher
        // dataZoom: [
        //   {
        //     type: 'slider',
        //     show: true,
        //     filterMode: 'empty',
        //   },
        //   {
        //     type: 'slider',
        //     show: true,
        //     yAxisIndex: 0,
        //     left: this.$vuetify.breakpoint.xsOnly
        //       ? DATAZOOM_Y_SLIDER_LEFT_SMALL
        //       : DATAZOOM_Y_SLIDER_LEFT,
        //     filterMode: 'filter',
        //   },
        //   {
        //     type: 'inside',
        //     // xAxisIndex: [0],
        //     yAxisIndex: 0,
        //     filterMode: 'filter',
        //   },
        // ],
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
  width: 250px;
  min-height: 600px;
  max-height: 2000px;
}
</style>
