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
  name: 'TaxaChartWrapper',
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
          textStyle: {
            fontSize: 14,
          },
        },

        grid: {
          show: true,
          top: 50,
          bottom: 140,
          left: '20px',
          containLabel: true,
          width: '200px',
        },

        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#ff5252',
            },
            crossStyle: {
              color: '#ff5252',
              width: 1,
              type: 'solid',
            },
          },
          formatter(params) {
            return `<span class="mr-2" style="display: inline-block; width: 10px; height: 10px; border-radius: 10px; background-color: ${params.color}"></span><span>${params.seriesName}
              <br />Depth: <b>${params.data[1]}</b></span>
              <br /><span>Value: <b>${params.data[0]}</b></span>`
          },
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
