<template>
  <div>
    <chart-flog
      v-if="analysisResults.length > 0 && sampleResults.length > 0"
      :analyses="analysisResults"
      :samples="sampleResults"
      :taxa="taxaResults"
      :min-depth="minDepth"
      :max-depth="maxDepth"
      :parameters="parameters"
      :title="
        $translate({
          et: localityObject.locality,
          en: localityObject.locality_en,
        })
      "
      :reverse="reversed"
    />
    <las-chart
      v-if="attachment && lasContent"
      class="pa-2"
      :class="{ 'pt-4': analysisResultsCount === 0 }"
      :hide-renderer-switch="analysisResultsCount > 0"
      :chart-title="chartTitle"
      :file-data="lasContent"
    />
  </div>
</template>

<script>
import isNil from 'lodash/isNil'
import LasChart from '~/components/chart/types/LasChart.vue'
import flogParameters from '~/utils/flogParameters'
import chartRange from '~/utils/chartRange'
import ChartFlog from '~/components/chart/ChartFlog.vue'

export default {
  components: { LasChart, ChartFlog },
  props: {
    localityObject: {
      type: Object,
      required: true,
    },
    attachment: {
      type: String,
      required: false,
      default: '',
    },
    analysisResultsCount: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  data() {
    return {
      lasContent: null,
      analysisResults: [],
      sampleResults: [],
      taxaResults: [],
      minDepth: 0,
      maxDepth: 0,
      parameters: [],
      reversed: false,
    }
  },
  async fetch() {
    let rawLasFileContent
    if (this.attachment) {
      const rawLasfileContentResponse =
        await this.$services.sarvREST.getResource('file', this.attachment, {
          params: {
            raw_content: 'true',
          },
        })

      rawLasFileContent = rawLasfileContentResponse
      if (
        typeof rawLasfileContentResponse === 'string' &&
        rawLasFileContent.startsWith('Error: ')
      )
        rawLasFileContent = ''
      this.lasContent = rawLasFileContent
    }
    const analysisResultsPromise = this.$services.sarvSolr.getResourceList(
      'analysis_results',
      {
        isValid: isNil('locality_id'),
        defaultParams: {
          fq: `locality_id:${this.$route.params.id}`,
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
        isValid: isNil('locality_id'),
        defaultParams: {
          fq: `locality_id:${this.$route.params.id} AND (depth:[* TO *] OR depth_interval:[* TO *])`,
          start: 0,
          rows: 50000,
          fl: 'id,sample_id,sample_number,depth,depth_interval,',
          sort: 'depth asc',
          stats: 'on',
          'stats.field': ['depth', 'depth_interval'],
        },
      }
    )

    const taxaPromise = this.$services.sarvSolr.getResourceList(
      'taxon_frequency',
      {
        isValid: isNil('locality_id'),
        defaultParams: {
          fq: `locality_id:${this.$route.params.id} AND (depth:[* TO *] OR depth_interval:[* TO *]) AND frequency:[0 TO *]`,
          start: 0,
          rows: 50000,
          fl: 'depth,depth_interval,frequency,taxon,taxon_id,',
          sort: 'depth asc',
          stats: 'on',
          'stats.field': ['taxon', 'depth'],
          'stats.calcdistinct': true,
        },
      }
    )

    // TODO: catch any failing promises
    const [analysisResultsResponse, sampleResponse, taxaResponse] =
      await Promise.all([analysisResultsPromise, samplesPromise, taxaPromise])

    const analysisResults = analysisResultsResponse?.items
    const sampleResults = sampleResponse?.items
    const taxaResults = taxaResponse?.items

    const [maxDepth, minDepth, reversed] = chartRange(
      [
        analysisResultsResponse.stats.stats_fields.depth.max,
        sampleResponse.stats.stats_fields.depth.max,
        sampleResponse.stats.stats_fields.depth_interval.max,
        taxaResponse.stats.stats_fields.depth.max,
      ],
      [
        analysisResultsResponse.stats.stats_fields.depth.min,
        sampleResponse.stats.stats_fields.depth.min,
        sampleResponse.stats.stats_fields.depth_interval.min,
        taxaResponse.stats.stats_fields.depth.min,
      ]
    )
    const parameters = flogParameters(analysisResultsResponse.facet.facet_pivot)
    this.analysisResults = analysisResults
    this.sampleResults = sampleResults
    this.taxaResults = taxaResults
    this.maxDepth = maxDepth
    this.minDepth = minDepth
    this.parameters = parameters
    this.reversed = reversed
  },
  computed: {
    chartTitle() {
      return this.$translate({
        et: this?.localityObject?.locality,
        en: this?.localityObject?.locality_en,
      })
    },
  },
}
</script>
