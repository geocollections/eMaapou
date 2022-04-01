<template>
  <client-only>
    <div class="pa-2">
      <external-legend-options
        v-if="initSelectedParameters.length > 0"
        :is-loading="isLoading"
        :checkboxes-object="methods"
        :all-items="parameters"
        :init-selected-items="initSelectedParameters"
        @update:selectedItems="selectedParameters = $event"
      />

      <external-legend-options
        v-if="initSelectedTaxa.length > 0 && false"
        :enable-checkboxes="false"
        :is-loading="isLoading"
        :all-items="taxa"
        :init-selected-items="initSelectedTaxa"
        select-field-title="statistics.activeTaxa"
        padding-top-zero
        @update:selectedItems="selectedTaxa = $event"
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

        <params-chart
          v-if="analysisResults.length > 0 && selectedParameters.length > 0"
          class="d-flex flex-row"
          :results="analysisResults"
          :params="selectedParameters"
          :min-depth="minDepth"
          :max-depth="maxDepth"
        />

        <taxa-chart
          v-if="taxaResults.length > 0 && selectedTaxa.length > 0 && false"
          class="d-flex flex-row"
          :results="taxaResults"
          :taxa="selectedTaxa"
          :min-depth="minDepth"
          :max-depth="maxDepth"
        />
      </div>
    </div>
  </client-only>
</template>

<script>
import isNil from 'lodash/isNil'
import { mapFields } from 'vuex-map-fields'
import ExternalLegendOptions from '~/components/chart/options/ExternalLegendOptions'
import RendererSwitch from '~/components/chart/options/RendererSwitch'
import ConnectionSwitch from '~/components/chart/options/ConnectionSwitch'
import SampleChart from '~/components/chart/types/SampleChart'
import StratigraphyChart from '~/components/chart/types/StratigraphyChart'
import TaxaChart from '~/components/chart/types/TaxaChart'
import ParamsChart from '~/components/chart/types/ParamsChart'

export default {
  components: {
    ParamsChart,
    TaxaChart,
    StratigraphyChart,
    SampleChart,
    ConnectionSwitch,
    RendererSwitch,
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
      // Depth
      depth: [],
      minDepth: null,
      maxDepth: null,
      // Results
      stratigraphyResults: [],
      analysisResults: [],
      sampleResults: [],
      taxaResults: [],
      // Analysis
      methods: {},
      parameters: [],
      selectedParameters: [],
      initSelectedParameters: [],
      // Taxa
      taxa: [],
      selectedTaxa: [],
      initSelectedTaxa: [],
    }
  },
  async fetch() {
    this.isLoading = true
    if (
      this.stratigraphyResults === 0 ||
      this.analysisResults.length === 0 ||
      this.sampleResults === 0 ||
      this.taxaResults === 0
    ) {
      const {
        // stratigraphyResponse,
        // stratigraphyStatsResponse,
        resultsResponse,
        statsResponse,
        sampleResponse,
        sampleStatsResponse,
        taxaResponse,
        taxaStatsResponse,
      } = await this.fetchChartData()

      // Results
      this.analysisResults = resultsResponse?.items
      this.sampleResults = sampleResponse?.items
      this.taxaResults = taxaResponse?.items

      // Depth
      // Depth may come from stratigraphy, samples, analyses or taxa
      this.depth = new Set([
        // Todo: Add depth from stratigraphyStatsResponse? (locality_description table is not in solr index)
        ...statsResponse?.stats?.stats_fields?.depth?.distinctValues,
        ...sampleStatsResponse?.stats?.stats_fields?.depth?.distinctValues,
        ...taxaStatsResponse?.stats?.stats_fields?.depth?.distinctValues,
      ])
      // Floor or Ceil to next tenth
      this.minDepth = Math.floor(Math.min(...this.depth) / 10) * 10
      this.maxDepth = Math.ceil(Math.max(...this.depth) / 10) * 10

      // Analysis
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
      this.parameters =
        statsResponse?.stats?.stats_fields?.parameter?.distinctValues
      this.selectedParameters = this.parameters.slice(
        0,
        this.parameters.length > 3 ? 3 : this.parameters.length
      )
      this.initSelectedParameters = this.selectedParameters

      // Taxa
      // this.taxa = taxaStatsResponse?.stats?.stats_fields?.taxon?.distinctValues
      this.taxa = this.taxaResults.reduce((prev, curr) => {
        if (!prev.includes(curr.taxon)) prev.push(curr.taxon)
        return prev
      }, [])
      this.selectedTaxa = this.taxa.slice(
        0,
        this.taxa.length > 3 ? 3 : this.taxa.length
      )
      this.initSelectedTaxa = this.selectedTaxa
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

      const sampleStatsResponse = await this.$services.sarvSolr.getResourceList(
        'sample',
        {
          isValid: isNil(this.tableId),
          defaultParams: {
            fq: `${this.tableKey}:${this.tableId}`,
            rows: 0,
            fl: 'depth',
            sort: 'depth asc',
            stats: 'on',
            'stats.field': ['depth'],
            'stats.calcdistinct': true,
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
            'stats.field': ['taxon', 'depth'],
            'stats.calcdistinct': true,
          },
        }
      )

      return {
        resultsResponse,
        statsResponse,
        sampleResponse,
        sampleStatsResponse,
        taxaResponse,
        taxaStatsResponse,
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
