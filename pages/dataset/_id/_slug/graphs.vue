<template>
  <flog
    :analyses="analysisResults"
    :samples="sampleResults"
    :min-depth="minDepth"
    :max-depth="maxDepth"
    :methods="methods"
  />
</template>

<script>
import isNil from 'lodash/isNil'
import Flog from '~/components/chart/Flog'
import flogParameters from '~/utils/flogParameters'
import chartRange from '~/utils/chartRange'
export default {
  components: { Flog },
  props: {
    datasetObject: {
      type: Object,
      default: () => {},
    },
  },
  async asyncData({ params, $services }) {
    const analysisResultsPromise = $services.sarvSolr.getResourceList(
      'analysis_results',
      {
        isValid: isNil('dataset_id'),
        defaultParams: {
          fq: `dataset_id:${params.id}`,
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
      isValid: isNil('dataset_id'),
      defaultParams: {
        fq: `dataset_id:${params.id} AND (depth:[* TO *] OR depth_interval:[* TO *])`,
        start: 0,
        rows: 50000,
        fl: 'id,sample_id,sample_number,depth,depth_interval,',
        sort: 'depth asc',
        stats: 'on',
        'stats.field': ['depth'],
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
      ],
      [
        analysisResultsResponse.stats.stats_fields.depth.min,
        sampleResponse.stats.stats_fields.depth.min,
      ]
    )
    const methods = flogParameters(analysisResultsResponse.facet.facet_pivot)

    return {
      analysisResults,
      sampleResults,
      minDepth,
      maxDepth,
      methods,
    }
  },
}
</script>
