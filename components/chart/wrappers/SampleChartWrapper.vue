<template>
  <client-only>
    <div>
      <v-chart
        class="chart"
        v-bind="$attrs"
        autoresize
        group="flog"
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
  name: 'SampleChartWrapper',
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
          text: 'Samples',
          left: 'center',
          textStyle: {
            fontSize: 14,
          },
        },

        grid: {
          // show: true,
          top: 50,
          bottom: 140,
          left: '20px',
          containLabel: true,
          width: '200px',
        },

        toolbox: {
          top: 20,
          right: 30,
          feature: {
            saveAsImage: {},
          },
        },

        dataZoom: [
          {
            type: 'inside',
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
          connect('flog')
        } else {
          disconnect('flog')
        }
      },
      immediate: true,
    },
  },

  mounted() {
    connect('flog')
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
