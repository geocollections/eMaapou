<template>
  <div>
    <chart-flog
      v-if="analysisResults.length > 0 && sampleResults.length > 0"
      :analyses="analysisResults"
      :samples="sampleResults"
      :min-depth="minDepth"
      :max-depth="maxDepth"
      :parameters="parameters"
      :title="
        $translate({
          et: drillcoreObject.drillcore,
          en: drillcoreObject.drillcore_en,
        })
      "
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
import LasChart from '~/components/chart/types/LasChart'
import flogParameters from '~/utils/flogParameters'
import chartRange from '~/utils/chartRange'
import ChartFlog from '~/components/chart/ChartFlog.vue'

export default {
  components: { LasChart, ChartFlog },
  props: {
    locality: {
      type: Number,
      default: null,
    },
    drillcoreObject: {
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
      minDepth: 0,
      maxDepth: 0,
      parameters: [],
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
    if (this.locality) {
      const analysisResultsPromise = this.$services.sarvSolr.getResourceList(
        'analysis_results',
        {
          isValid: isNil('locality_id'),
          defaultParams: {
            fq: `locality_id:${this.locality}`,
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
            fq: `locality_id:${this.locality} AND (depth:[* TO *] OR depth_interval:[* TO *])`,
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
      const parameters = flogParameters(
        analysisResultsResponse.facet.facet_pivot
      )
      this.analysisResults = analysisResults
      this.sampleResults = sampleResults
      this.maxDepth = maxDepth
      this.minDepth = minDepth
      this.parameters = parameters
    }
  },
  computed: {
    chartTitle() {
      return this.$translate({
        et: this?.drillcoreObject?.drillcore,
        en: this?.drillcoreObject?.drillcore_en,
      })
    },
  },
}
</script>
