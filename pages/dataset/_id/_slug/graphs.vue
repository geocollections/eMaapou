<template>
  <div>
    <chart-flog
      v-if="analysisResults.length > 0 && sampleResults.length > 0"
      :analyses="analysisResults"
      :samples="sampleResults"
      :min-depth="minDepth"
      :max-depth="maxDepth"
      :parameters="parameters"
      :title="dataset.title"
      :reverse="reversed"
    />
  </div>
</template>

<script>
import isNil from 'lodash/isNil'
import ChartFlog from '~/components/chart/ChartFlog.vue'
import flogParameters from '~/utils/flogParameters'
import chartRange from '~/utils/chartRange'
export default {
  components: { ChartFlog },
  props: {
    dataset: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      analysisResults: {},
      sampleResults: {},
      minDepth: 0,
      maxDepth: 0,
      reversed: false,
      parameters: [],
    }
  },
  async fetch() {
    const analysisResultsPromise = this.$services.sarvSolr.getResourceList(
      'analysis_results',
      {
        isValid: isNil('dataset_ids'),
        defaultParams: {
          fq: `dataset_ids:${this.$route.params.id}`,
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
        isValid: isNil('dataset_ids'),
        defaultParams: {
          fq: `dataset_ids:${this.$route.params.id} AND (depth:[* TO *] OR depth_interval:[* TO *])`,
          start: 0,
          rows: 50000,
          fl: 'id,sample_id,sample_number,depth,depth_interval,',
          sort: 'depth asc',
          stats: 'on',
          'stats.field': ['depth', 'depth_interval'],
        },
      }
    )

    // TODO: catch any failing promises
    const [analysisResultsResponse, sampleResponse] = await Promise.all([
      analysisResultsPromise,
      samplesPromise,
    ])

    const analysisResults = analysisResultsResponse?.items
    const sampleResults = sampleResponse?.items

    const [maxDepth, minDepth, reversed] = chartRange(
      [
        analysisResultsResponse.stats.stats_fields.depth.max,
        sampleResponse.stats.stats_fields.depth.max,
        sampleResponse.stats.stats_fields.depth_interval.max,
      ],
      [
        analysisResultsResponse.stats.stats_fields.depth.min,
        sampleResponse.stats.stats_fields.depth.min,
        sampleResponse.stats.stats_fields.depth_interval.min,
      ]
    )
    const parameters = flogParameters(analysisResultsResponse.facet.facet_pivot)

    this.analysisResults = analysisResults
    this.sampleResults = sampleResults
    this.minDepth = minDepth
    this.maxDepth = maxDepth
    this.reversed = reversed
    this.parameters = parameters
  },
  computed: {
    title() {
      return this.dataset?.title
    },
  },
}
</script>
