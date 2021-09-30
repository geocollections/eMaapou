<template>
  <client-only>
    <div>
      <v-chart
        class="chart"
        v-bind="$attrs"
        autoresize
        group="multi"
        :init-options="initOptions"
        :option="computedOptions"
        v-on="$listeners"
      />
    </div>
  </client-only>
</template>

<script>
import deepmerge from 'deepmerge'
import { mapState } from 'vuex'
import { connect, disconnect } from 'echarts/core'
export default {
  name: 'MultiChartWrapper',
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
        // title also gets updated in watcher
        title: {
          text: 'Chart title',
          left: 'center',
          textStyle: {
            fontSize: 14,
          },
        },

        // grid also gets updated in watcher
        grid: {
          show: true,
          top: 50,
          bottom: 140,
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

        toolbox: {
          top: 20,
          right: 30,
          feature: {
            saveAsImage: {},
            // restore: {},
            // dataView: {},
            // dataZoom: {},
            // brush: {
            //   type: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
            // },
          },
        },

        // dataZoom also gets updated in watcher
        dataZoom: [
          // {
          //   type: 'slider',
          //   show: true,
          //   filterMode: 'empty',
          // },
          // {
          //   type: 'slider',
          //   show: true,
          //   yAxisIndex: 0,
          //   left: this.$vuetify.breakpoint.xsOnly
          //     ? DATAZOOM_Y_SLIDER_LEFT_SMALL
          //     : DATAZOOM_Y_SLIDER_LEFT,
          //   filterMode: 'filter',
          // },
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
    ...mapState('chart', ['renderer', 'connected']),
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
    connected: {
      handler(value) {
        if (value) {
          connect('multi')
        } else {
          disconnect('multi')
        }
      },
      immediate: true,
    },
  },

  mounted() {
    connect('multi')
  },
}
</script>

<style scoped>
.chart {
  height: 90vh;
  width: 250px;
  min-height: 600px;
  max-height: 2000px;
}
</style>
