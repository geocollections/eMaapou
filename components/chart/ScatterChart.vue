<template>
  <div class="pa-2">
    <external-legend-options
      v-if="initSelectedParameters.length > 0"
      :is-loading="isLoading"
      :checkboxes-object="methods"
      :all-items="parameters"
      :init-selected-items="initSelectedParameters"
      @update:selectedItems="selectedParameters = $event"
    />

    <chart-wrapper v-if="!isLoading" :options="chartOptions" />
  </div>
</template>

<script>
import { isNil } from 'lodash'
import ChartWrapper from '~/components/chart/ChartWrapper'
import ExternalLegendOptions from '~/components/chart/ExternalLegendOptions'

export default {
  components: { ExternalLegendOptions, ChartWrapper },
  props: {
    tableKey: {
      type: String,
      required: true,
      default: 'locality_id',
    },
    tableId: {
      type: Number,
      default: null,
    },
    tableObject: {
      type: Object,
      default: () => {},
    },
    chartTitle: {
      type: String,
      required: true,
      default: 'Chart title',
    },
  },
  data() {
    return {
      isLoading: false,
      analysisResults: [],
      depth: [],
      parameters: [],
      selectedParameters: [],
      methods: {},
      initSelectedParameters: [],
    }
  },
  async fetch() {
    this.isLoading = true
    if (this.analysisResults.length === 0) {
      const { resultsResponse, statsResponse } = await this.fetchChartData()

      this.analysisResults = resultsResponse?.items
      this.depth = statsResponse?.stats?.stats_fields?.depth?.distinctValues
      this.parameters =
        statsResponse?.stats?.stats_fields?.parameter?.distinctValues

      const methodKey =
        this.$i18n.locale === 'en' ? 'analysis_method_en' : 'analysis_method'
      this.methods =
        statsResponse?.stats?.stats_fields?.[methodKey]?.distinctValues
      this.methods = this.methods.reduce((prev, curr) => {
        prev[curr] = [
          ...new Set(
            this.analysisResults
              .filter((item) => item[methodKey] === curr)
              .map((item) => item.parameter)
          ),
        ]
        return prev
      }, {})

      this.selectedParameters = this.parameters.slice(
        0,
        this.parameters.length > 3 ? 3 : this.parameters.length
      )
      this.initSelectedParameters = this.selectedParameters
    }
    this.isLoading = false
  },
  computed: {
    chartOptions() {
      if (
        this?.analysisResults?.length > 0 &&
        this?.depth?.length > 0 &&
        this?.parameters?.length > 0
      ) {
        return {
          animation: false,

          title: {
            text: this.chartTitle,
          },

          legend: this.buildChartLegend(),

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
            min(value) {
              return (value.min - 0.1).toFixed(2) * 1
            },
            max(value) {
              return (value.max + 0.1).toFixed(2) * 1
            },
            data: this.depth,
          },

          yAxis: this.buildYAxis(),

          series: this.buildChartSeries(),
        }
      } else return {}
    },
  },
  methods: {
    async fetchChartData() {
      const resultsResponse = await this.$services.sarvSolr.getResourceList(
        'analysis_results',
        {
          useRawSolr: true,
          isValid: isNil(this.tableId),
          defaultParams: {
            fq: `${this.tableKey}:${this.tableId}`,
            start: 0,
            rows: 50000,
            fl:
              'id,analysis_id,depth,depth_interval,parameter,analysis_method,analysis_method_en,value',
            sort: 'depth asc',
          },
        }
      )

      const statsResponse = await this.$services.sarvSolr.getResourceList(
        'analysis_results',
        {
          useRawSolr: true,
          isValid: isNil(this.tableId),
          defaultParams: {
            fq: `${this.tableKey}:${this.tableId}`,
            rows: 0,
            fl: 'depth',
            sort: 'depth asc, parameter asc',
            stats: 'on',
            'stats.field': [
              'depth',
              'parameter',
              'analysis_method',
              'analysis_method_en',
            ],
            'stats.calcdistinct': true,
          },
        }
      )

      return { resultsResponse, statsResponse }
    },

    buildChartTitle() {
      return {
        text: this.$translate({
          et: this?.localityObject?.locality,
          en: this?.localityObject?.locality_en,
        }),
      }
    },

    buildChartLegend() {
      return {
        data: this.selectedParameters,
        selected: this.parameters.reduce((prev, curr) => {
          prev[curr] = this.selectedParameters.includes(curr)
          return prev
        }, {}),
      }
    },

    buildChartSeries() {
      return this.parameters.map((item) => {
        return {
          name: item,
          type: 'line',
          yAxisIndex: item.includes('ppm') ? 1 : 0,
          data: this.analysisResults
            .filter((result) => result.parameter === item)
            .map((t) => [t.depth, t.value]),
          // symbolSize: 8,
          emphasis: {
            focus: 'series',
          },
        }
      })
    },

    buildYAxis() {
      const yAxis = [
        {
          type: 'value',
          name: 'Value',
          nameLocation: 'center',
          nameTextStyle: {
            fontWeight: 'bold',
            fontSize: 16,
          },
          nameGap: 55,
          min(value) {
            return (value.min - 0.1).toFixed(2) * 1
          },
          max(value) {
            return (value.max + 0.1).toFixed(2) * 1
          },
        },
        {
          type: 'value',
          name: 'ppm',
          nameLocation: 'center',
          nameTextStyle: {
            fontWeight: 'bold',
            fontSize: 16,
          },
          nameGap: 30,
          min(value) {
            return (value.min - 0.1).toFixed(2) * 1
          },
          max(value) {
            return (value.max + 0.1).toFixed(2) * 1
          },
        },
      ]
      if (this.selectedParameters.some((item) => item.includes('ppm')))
        yAxis[1].name = 'ppm'
      else yAxis[1].name = ''
      return yAxis
    },
  },
}
</script>
