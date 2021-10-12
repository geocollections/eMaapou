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

    <div class="mb-2 d-flex flex-row flex-wrap">
      <renderer-switch
        class="mr-4"
        :renderer="renderer"
        @update="renderer = $event"
      />

      <connection-switch
        v-if="parameters.length > 1"
        :input-value="connected"
        @change="connected = $event"
      />
    </div>

    <!-- Todo: Review all chart wrappers and limit it to only one wrapper -->

    <div v-if="!isLoading" class="charts d-flex flex-row">
      <!-- Todo: Stratigraphy chart -->
      <!-- Disabled as it's not ready yet -->
      <stratigraphy-chart
        v-if="stratigraphyResults.length > 0 && false"
        :results="stratigraphyResults"
      />

      <sample-chart
        v-if="sampleResults.length > 0 && minDepth && maxDepth"
        :results="sampleResults"
        :min-depth="minDepth"
        :max-depth="maxDepth"
      />

      <multi-chart-wrapper
        v-for="(item, index) in selectedParameters"
        :key="index"
        :options="optionsUsingParameter(item)"
      />

      <!-- Todo: Taxa chart -->
      <!-- Could be category chart where taxon names are categories and item size is taxon frequency-->
      <taxa-chart
        v-if="taxaResults.length > 0 && taxa.length > 0"
        :results="taxaResults"
        :taxa="taxa"
        :min-depth="minDepth"
        :max-depth="maxDepth"
      />
    </div>
  </div>
</template>

<script>
import { isNil } from 'lodash'
import { mapFields } from 'vuex-map-fields'
import ExternalLegendOptions from '~/components/chart/options/ExternalLegendOptions'
import MultiChartWrapper from '~/components/chart/wrappers/MultiChartWrapper'
import RendererSwitch from '~/components/chart/options/RendererSwitch'
import ConnectionSwitch from '~/components/chart/options/ConnectionSwitch'
import SampleChart from '~/components/chart/types/SampleChart'
import StratigraphyChart from '~/components/chart/types/StratigraphyChart'
import TaxaChart from '~/components/chart/types/TaxaChart'

export default {
  components: {
    TaxaChart,
    StratigraphyChart,
    SampleChart,
    ConnectionSwitch,
    RendererSwitch,
    MultiChartWrapper,
    ExternalLegendOptions,
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
      minDepth: null,
      maxDepth: null,
      sampleResults: [],
      stratigraphyResults: [],
      taxaResults: [],
      taxa: [],
    }
  },
  async fetch() {
    this.isLoading = true
    if (this.analysisResults.length === 0) {
      const {
        resultsResponse,
        statsResponse,
        sampleResponse,
        taxaResponse,
        taxaStatsResponse,
      } = await this.fetchChartData()

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
      this.minDepth = Math.min(...this.depth)
      this.maxDepth = Math.max(...this.depth)

      this.sampleResults = sampleResponse?.items
      this.taxaResults = taxaResponse?.items
      this.taxa = taxaStatsResponse?.stats?.stats_fields?.taxon?.distinctValues

      console.log(this.taxaResults)
      console.log(this.taxa)
    }
    this.isLoading = false
  },
  computed: {
    ...mapFields('chart', ['renderer', 'connected']),
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

      const sampleResponse = await this.$services.sarvSolr.getResourceList(
        'sample',
        {
          isValid: isNil(this.tableId),
          defaultParams: {
            fq: `${this.tableKey}:${this.tableId} AND (depth:[* TO *] OR depth_interval:[* TO *])`,
            start: 0,
            rows: 50000,
            fl: 'id,number,depth,depth_interval,',
            sort: 'depth asc',
          },
        }
      )

      const taxaResponse = await this.$services.sarvSolr.getResourceList(
        'taxon_frequency',
        {
          isValid: isNil(this.tableId),
          defaultParams: {
            fq: `${this.tableKey}:${this.tableId} AND (depth:[* TO *] OR depth_interval:[* TO *]) AND frequency:[0 TO *]`,
            start: 0,
            rows: 50000,
            fl: 'depth,depth_interval,frequency,taxon,taxon_id,',
            sort: 'depth asc',
          },
        }
      )

      const taxaStatsResponse = await this.$services.sarvSolr.getResourceList(
        'taxon_frequency',
        {
          isValid: isNil(this.tableId),
          defaultParams: {
            fq: `${this.tableKey}:${this.tableId}`,
            rows: 0,
            fl: 'depth',
            sort: 'depth asc',
            stats: 'on',
            'stats.field': ['taxon'],
            'stats.calcdistinct': true,
          },
        }
      )

      return {
        resultsResponse,
        statsResponse,
        sampleResponse,
        taxaResponse,
        taxaStatsResponse,
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

    buildXAxis(param) {
      return {
        show: true,
        position: 'bottom',
        type: 'value',
        name: param.substring(param.indexOf('[') + 1, param.indexOf(']')),
        nameLocation: 'center',
        nameTextStyle: {
          fontWeight: 'bold',
          padding: [7, 0, 0, 0],
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
    },

    buildYAxis() {
      return {
        type: 'value',
        boundaryGap: false,
        name: 'Depth',
        nameLocation: 'end',
        nameTextStyle: {
          fontWeight: 'bold',
        },
        nameGap: 10,
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
        // Todo: Maybe review that logic
        max:
          this.maxDepth > 0 && this.maxDepth > this.minDepth
            ? this.minDepth * -1
            : this.maxDepth,
        min:
          this.minDepth > 0 && this.minDepth < this.maxDepth
            ? this.maxDepth * -1
            : this.minDepth,
      }
    },

    buildChartSeries(param) {
      return [
        {
          name: param,
          type: 'line',
          smooth: false,
          xAxisIndex: 0,
          data: this.analysisResults
            .filter((result) => result.parameter === param)
            .map((t) => [t.value, t.depth * -1]),
          emphasis: {
            focus: 'series',
          },
        },
      ]
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

<style lang="scss">
.charts {
  overflow-x: auto;
}
</style>
