<template>
  <chart-flog
    v-if="analysisResults.length > 0 && sampleResults.length > 0"
    :analyses="analysisResults"
    :samples="sampleResults"
    :min-depth="minDepth"
    :max-depth="maxDepth"
    :parameters="parameters"
    :title="title"
  />
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
      default: () => {},
    },
  },
  async asyncData({ params, $services }) {
    const analysisResultsPromise = $services.sarvSolr.getResourceList(
      'analysis_results',
      {
        isValid: isNil('dataset_ids'),
        defaultParams: {
          fq: `dataset_ids:${params.id}`,
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
    const samplesPromise = $services.sarvSolr.getResourceList('sample_data', {
      isValid: isNil('dataset_ids'),
      defaultParams: {
        fq: `dataset_ids:${params.id} AND (depth:[* TO *] OR depth_interval:[* TO *])`,
        start: 0,
        rows: 50000,
        fl: 'id,sample_id,sample_number,depth,depth_interval,',
        sort: 'depth asc',
        stats: 'on',
        'stats.field': ['depth', 'depth_interval'],
      },
    })

    // TODO: catch any failing promises
    const [analysisResultsResponse, sampleResponse] = await Promise.all([
      analysisResultsPromise,
      samplesPromise,
    ])

    const analysisResults = analysisResultsResponse?.items
    const sampleResults = sampleResponse?.items

    const [maxDepth, minDepth] = chartRange(
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

    return {
      analysisResults,
      sampleResults,
      minDepth,
      maxDepth,
      parameters,
    }
  },
  computed: {
    title() {
      return this.$translate({
        et: this.dataset?.name,
        en: this.dataset?.name_en,
      })
    },
  },
}
</script>
