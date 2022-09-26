<template>
  <div>
    <v-chart
      class="chart"
      v-bind="$attrs"
      autoresize
      group="flog"
      :init-options="initOptions"
      :option="computedOptions"
      v-on="$listeners"
      @click="handleClick"
    />
  </div>
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

  methods: {
    // Click event opens sample detail view
    handleClick(event) {
      if (event?.data?.sampleId)
        this.$openNuxtWindow('sample-id', { id: event.data.sampleId })
    },
  },
}
</script>

<style scoped>
.chart {
  height: 90vh;
  width: 230px;
  min-height: 600px;
  max-height: 2000px;
}
</style>
