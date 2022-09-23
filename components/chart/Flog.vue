<template>
  <div class="pa-2">
    <div class="mb-2 d-flex flex-row flex-wrap">
      <options-method-tree-view
        :methods="methods"
        :initial-selection="selectedParameters"
        @input="handleMethodsUpdate"
      />
      <renderer-switch :renderer="renderer" @update="renderer = $event" />

      <connection-switch
        :input-value="connected"
        @change="connected = $event"
      />
    </div>

    <!-- Todo: Review all chart wrappers and limit it to only one wrapper -->

    <div v-if="!isLoading" class="charts d-flex flex-row">
      <!-- Todo: Stratigraphy chart -->
      <!-- Disabled as it's not ready yet -->
      <!-- <stratigraphy-chart
          v-if="stratigraphyResults.length > 0 && false"
          :results="stratigraphyResults"
        /> -->
      <sample-chart
        v-if="sampleResults.length > 0 && minDepth && maxDepth"
        :results="sampleResults"
        :chart-title="$t('sampleChart.title')"
        :y-min="minDepth"
        :y-max="maxDepth"
      />

      <div
        v-if="analysisResults.length > 0 && selectedParameters.length > 0"
        class="d-flex flex-row"
      >
        <params-chart
          v-for="(param, index) in selectedParameters"
          :key="index"
          :results="
            analysisResults.filter((result) => result.parameter === param.name)
          "
          :param="param.name"
          :chart-title="param.name"
          :y-min="minDepth"
          :y-max="maxDepth"
        />
      </div>

      <!-- <taxa-chart
          v-if="taxaResults.length > 0 && selectedTaxa.length > 0 && false"
          class="d-flex flex-row"
          :results="taxaResults"
          :taxa="selectedTaxa"
          :min-depth="minDepth"
          :max-depth="maxDepth"
        /> -->
    </div>
  </div>
</template>

<script>
import isNil from 'lodash/isNil'
import { mapFields } from 'vuex-map-fields'
import RendererSwitch from '~/components/chart/options/RendererSwitch'
import ConnectionSwitch from '~/components/chart/options/ConnectionSwitch'
import SampleChart from '~/components/chart/types/SampleChart'
import ParamsChart from '~/components/chart/types/ParamsChart'
import OptionsMethodTreeView from '~/components/chart/options/OptionsMethodTreeView.vue'
export default {
  components: {
    ParamsChart,
    SampleChart,
    ConnectionSwitch,
    RendererSwitch,
    OptionsMethodTreeView,
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
      methods: [],
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
      const { analysisResultsResponse, sampleResponse } =
        await this.fetchChartData()
      // Results
      this.analysisResults = analysisResultsResponse?.items
      this.sampleResults = sampleResponse?.items
      // this.taxaResults = taxaResponse?.items
      this.minDepth = Math.min(
        analysisResultsResponse.stats.stats_fields.depth.min,
        sampleResponse.stats.stats_fields.depth.min
      )
      this.maxDepth = Math.max(
        analysisResultsResponse.stats.stats_fields.depth.max,
        sampleResponse.stats.stats_fields.depth.max
      )

      if (
        this.maxDepth > 0 &&
        this.minDepth > 0 &&
        this.maxDepth > this.minDepth
      )
        [this.maxDepth, this.minDepth] = [-this.minDepth, -this.maxDepth]

      let id = 0
      this.methods = this.zip(
        ...Object.values(analysisResultsResponse.facet.facet_pivot)
      ).map(([method, methodParameters]) => {
        id += 1
        return {
          value: method.value,
          id,
          name: method.pivot[0].value,
          name_en: method.pivot[0].pivot[0].value,
          count: method.count,
          children: methodParameters.pivot.map((parameter) => {
            id += 1
            return {
              value: parameter.value,
              id,
              count: parameter.count,
              name: parameter.pivot[0].value,
            }
          }),
        }
      })
      if (this.methods.length > 0) {
        this.selectedParameters = this.methods[0].children.slice(
          0,
          this.methods[0].children.length > 3
            ? 3
            : this.methods[0].children.length
        )
      }

      // Taxa
      // this.taxa = taxaStatsResponse?.stats?.stats_fields?.taxon?.distinctValues
      this.taxa = this.taxaResults.reduce((prev, curr) => {
        if (!prev.includes(curr.taxon)) prev.push(curr.taxon)
        return prev
      }, [])
      // this.selectedTaxa = this.taxa.slice(
      //   0,
      //   this.taxa.length > 3 ? 3 : this.taxa.length
      // )
      this.initSelectedTaxa = this.selectedTaxa
    }
    this.isLoading = false
  },
  computed: {
    ...mapFields('chart', ['renderer', 'connected']),
  },
  methods: {
    zip(arr, ...arrs) {
      return arr.map((val, i) => arrs.reduce((a, arr) => [...a, arr[i]], [val]))
    },
    handleMethodsUpdate(event) {
      this.selectedParameters = event
    },
    async fetchChartData() {
      const analysisResultsPromise = this.$services.sarvSolr.getResourceList(
        'analysis_results',
        {
          isValid: isNil(this.tableId),
          defaultParams: {
            fq: `${this.tableKey}:${this.tableId}`,
            start: 0,
            rows: 50000,
            fl: 'id,analysis_id,depth,depth_interval,parameter,method_id,value',
            sort: 'depth asc',
            stats: 'on',
            'stats.field': ['depth'],
            facet: 'on',
            'facet.pivot': [
              'method_id,analysis_method,analysis_method_en',
              'method_id,parameter_id,parameter',
            ],
          },
        }
      )

      const samplesPromise = this.$services.sarvSolr.getResourceList(
        'sample_data',
        {
          isValid: isNil(this.tableId),
          defaultParams: {
            fq: `${this.tableKey}:${this.tableId} AND (depth:[* TO *] OR depth_interval:[* TO *])`,
            start: 0,
            rows: 50000,
            fl: 'id,sample_id,sample_number,depth,depth_interval,',
            sort: 'depth asc',
            stats: 'on',
            'stats.field': ['depth'],
          },
        }
      )

      // TODO: catch any failing promises
      const [analysisResultsResponse, sampleResponse] = await Promise.all([
        analysisResultsPromise,
        samplesPromise,
      ])

      // const taxaResponse = await this.$services.sarvSolr.getResourceList(
      //   'taxon_frequency',
      //   {
      //     isValid: isNil(this.tableId),
      //     defaultParams: {
      //       fq: `${this.tableKey}:${this.tableId} AND (depth:[* TO *] OR depth_interval:[* TO *]) AND frequency:[0 TO *]`,
      //       start: 0,
      //       rows: 50000,
      //       fl: 'depth,depth_interval,frequency,taxon,taxon_id,',
      //       sort: 'depth asc',
      //     },
      //   }
      // )

      // const taxaStatsResponse = await this.$services.sarvSolr.getResourceList(
      //   'taxon_frequency',
      //   {
      //     isValid: isNil(this.tableId),
      //     defaultParams: {
      //       fq: `${this.tableKey}:${this.tableId}`,
      //       rows: 0,
      //       fl: 'depth',
      //       sort: 'depth asc',
      //       stats: 'on',
      //       'stats.field': ['taxon', 'depth'],
      //       'stats.calcdistinct': true,
      //     },
      //   }
      // )

      return {
        analysisResultsResponse,
        sampleResponse,
        // taxaResponse,
        // taxaStatsResponse,
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
