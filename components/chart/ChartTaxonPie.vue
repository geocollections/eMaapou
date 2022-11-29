<template>
  <div class="pa-2">
    <v-chart
      class="chart"
      autoresize
      :init-options="initOptions"
      :option="computedOptions"
      v-on="$listeners"
    />
  </div>
</template>

<script>
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { PieChart } from 'echarts/charts'
import deepmerge from 'deepmerge'
import { mapFields } from 'vuex-map-fields'
import { CanvasRenderer } from 'echarts/renderers'
import {
  GridComponent,
  TitleComponent,
  LegendComponent,
  ToolboxComponent,
} from 'echarts/components'
import {
  LEGEND_TOP,
  TITLE_FONT_SIZE,
  TITLE_FONT_SIZE_SMALL,
  TITLE_TOP,
  TITLE_TOP_SMALL,
  TOOLBOX_RIGHT,
} from '~/constants'
use([
  PieChart,
  CanvasRenderer,
  GridComponent,
  TitleComponent,
  LegendComponent,
  ToolboxComponent,
])
export default {
  name: 'ChartTaxonPie',
  components: { VChart },
  props: {
    chartTitle: {
      type: String,
      required: true,
      default: 'Chart title',
    },
    taxonData: {
      type: Array,
      required: true,
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
        toolbox: {
          right: TOOLBOX_RIGHT,
          feature: {
            saveAsImage: {},
            dataView: { readOnly: true },
          },
        },
      },
    }
  },
  computed: {
    ...mapFields('chart', ['renderer']),
    chartOptions() {
      return {
        title: {
          text: this.chartTitle,
        },
        legend: {},
        grid: {
          show: false,
        },
        series: this.buildChartSeries(),
      }
    },
    computedOptions() {
      // Todo: Keep an eye on options if series or any other option which should/shouldn't exist then errors start showing,
      const deepMergedObject = deepmerge(this.defaultOptions, this.chartOptions)
      if (deepMergedObject?.series?.length > 0) return deepMergedObject
      else return {}
    },
    initOptions() {
      return {
        renderer: this.renderer,
      }
    },
  },
  methods: {
    buildChartSeries() {
      return [
        {
          type: 'pie',
          radius: '50%',
          itemStyle: {
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#fff',
          },
          data: this.taxonData,
        },
      ]
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
