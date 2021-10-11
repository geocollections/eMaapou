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
import ExternalLegendOptions from '~/components/chart/options/ExternalLegendOptions'

export default {
  components: {
    ExternalLegendOptions,
    ChartWrapper,
  },
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

          yAxis: this.buildYAxis(),

          xAxis: this.buildXAxis(),

          series: this.buildChartSeries(),
        }
      } else return {}
    },

    units() {
      return this.parameters.reduce((prev, curr) => {
        if (curr.includes('[') && curr.includes(']')) {
          const unit = curr.substring(curr.indexOf('[') + 1, curr.indexOf(']'))
          if (!prev.includes(unit)) prev.push(unit)
        }
        return prev
      }, [])
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

    buildXAxis(param) {
      if (param) {
        return {
          // If unit in selectedParams then show xAxis otherwise it is just hidden
          show: true,
          position: 'bottom',
          // Calculates axisLabel offset, adds +25 after every axis
          // offset: index * 25,
          type: 'value',
          name: param.substring(param.indexOf('[') + 1, param.indexOf(']')),
          nameTextStyle: {
            fontWeight: 'bold',
          },
          min(value) {
            return (value.min - 0.1).toFixed(2) * 1
          },
          max(value) {
            return (value.max + 0.1).toFixed(2) * 1
          },
          splitNumber: 2,
          axisLine: {
            show: true,
            symbol: ['none', 'arrow'],
            symbolSize: [5, 5],
          },
        }
      } else {
        // Tried to use activeUnits but then sometimes chart xAxis is not updated
        //  and some overlapping happens (data object is correct but visually overlaps)
        return this.units.map((item, index) => {
          return {
            // If unit in selectedParams then show xAxis otherwise it is just hidden
            show: this.selectedParameters.some((param) => param.includes(item)),
            position: 'bottom',
            // Calculates axisLabel offset, adds +25 after every axis
            offset: index * 25,
            type: 'value',
            name: item,
            nameTextStyle: {
              fontWeight: 'bold',
            },
            min(value) {
              return (value.min - 0.1).toFixed(2) * 1
            },
            max(value) {
              return (value.max + 0.1).toFixed(2) * 1
            },
            splitNumber: 2,
            axisLine: {
              show: true,
              symbol: ['none', 'arrow'],
              symbolSize: [5, 5],
            },
          }
        })
      }
    },

    buildYAxis() {
      return {
        type: 'value',
        boundaryGap: false,
        name: 'Depth',
        nameLocation: 'end',
        nameTextStyle: {
          fontWeight: 'bold',
          // fontSize: 14,
          padding: [0, 70, 0, 0],
        },
        nameGap: 10,
        splitNumber: 7,
        axisTick: {
          alignWithLabel: true,
        },
        min(value) {
          return (value.min - 0.1).toFixed(2) * 1
        },
        max(value) {
          return (value.max + 0.1).toFixed(2) * 1
        },
        // data: this.depth,
      }
    },

    buildChartSeries(param) {
      if (param) {
        return [
          {
            name: param,
            type: 'line',
            // Setting data to corresponding xAxis (units order is defined
            //  which means xAxis order is the same)
            xAxisIndex: 0,
            data: this.analysisResults
              .filter((result) => result.parameter === param)
              .map((t) => [t.value, t.depth * -1]),
            emphasis: {
              focus: 'series',
            },
          },
        ]
      } else {
        return this.selectedParameters.map((item) => {
          return {
            name: item,
            type: 'line',
            // Setting data to corresponding xAxis (units order is defined
            //  which means xAxis order is the same)
            xAxisIndex: this.units.findIndex((unit) => item.includes(unit)),
            data: this.analysisResults
              .filter((result) => result.parameter === item)
              .map((t) => [t.value, t.depth]),
            emphasis: {
              focus: 'series',
            },
          }
        })
      }
    },

    optionsUsingParameter(param) {
      return {
        animation: false,

        title: {
          text: param,
        },

        yAxis: this.buildYAxis(),

        xAxis: this.buildXAxis(param),

        series: this.buildChartSeries(param),
      }
    },
  },
}
</script>
