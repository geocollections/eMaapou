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
      type: String,
      default: '',
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
      this.resultValues =
        statsResponse?.stats?.stats_fields?.value?.distinctValues

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
        (this?.depth?.length > 0 || this?.resultValues?.length > 0) &&
        this?.parameters?.length > 0
      ) {
        return {
          animation: false,

          title: {
            text: this.chartTitle,
          },

          legend: this.buildChartLegend(),

          yAxis: this.buildYAxis(),

          xAxis: this.buildXAxis(),

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
          isValid: isNil(this.tableId),
          defaultParams: {
            fq: `${this.tableKey}:${this.tableId}`,
            start: 0,
            rows: 50000,
            fl: 'id,analysis_id,depth,depth_interval,parameter,analysis_method,analysis_method_en,value',
            sort: 'depth asc',
          },
        }
      )

      const statsResponse = await this.$services.sarvSolr.getResourceList(
        'analysis_results',
        {
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
              'value',
            ],
            'stats.calcdistinct': true,
          },
        }
      )

      return { resultsResponse, statsResponse }
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

    buildXAxis() {
      const units = this.parameters.reduce((prev, curr) => {
        if (curr.includes('[') && curr.includes(']')) {
          const unit = curr.substring(curr.indexOf('[') + 1, curr.indexOf(']'))
          if (!prev.includes(unit)) prev.push(unit)
        }
        return prev
      }, [])

      console.log(units)

      return units.map((item, index) => {
        return {
          // Todo: Could we make it toggleable using legend?
          show: this.selectedParameters.some((param) => param.includes(item)),
          position: 'bottom',
          // Calculates axisLabel offset, adds +25 after every axis
          offset: index * 25,
          type: 'value',
          name: item,
          nameLocation: 'end',
          nameTextStyle: {
            fontWeight: 'bold',
          },
          // min(value) {
          //   return (value.min - 0.1).toFixed(2) * 1
          // },
          // max(value) {
          //   return (value.max + 0.1).toFixed(2) * 1
          // },
          splitNumber: 2,
          axisLine: {
            show: true,
            symbol: ['none', 'arrow'],
            symbolSize: [5, 5],
          },
          // Todo: Get correct Unit from API (currently metadata omits it)
          // axisLabel: {
          //   formatter(value) {
          //     return `${value} ${item}`
          //   },
          // },
        }
      })
    },

    buildYAxis() {
      return {
        type: 'value',
        boundaryGap: false,
        name: this?.depth?.length > 0 ? 'DEPTH' : 'VALUES',
        nameLocation: 'end',
        nameTextStyle: {
          fontWeight: 'bold',
          // fontSize: 14,
          padding: [0, 70, 0, 0],
        },
        // nameGap: 25,
        splitNumber: 7,
        axisTick: {
          alignWithLabel: true,
        },
        // min(value) {
        //   return (value.min - 0.1).toFixed(2) * 1
        // },
        // max(value) {
        //   return (value.max + 0.1).toFixed(2) * 1
        // },
        data: this?.depth?.length > 0 ? this.depth : this.resultValues,
      }
    },

    buildChartSeries() {
      return this.selectedParameters.map((item) => {
        console.log(item)
        return {
          name: item,
          type: 'line',
          xAxisIndex: item.includes('ppm') ? 0 : 1,
          data: this.analysisResults
            .filter((result) => result.parameter === item)
            .map((t) => [t.value, t.depth ?? t.value]),
          // symbolSize: 8,
          emphasis: {
            focus: 'series',
          },
        }
      })
    },
  },
}
</script>
