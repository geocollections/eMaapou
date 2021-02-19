<template>
  <table-wrapper
    :headers="headers"
    :items="analyses"
    :init-options="options"
    :count="count"
    @update="handleUpdate"
  >
  </table-wrapper>
</template>

<script>
import { round, isNil } from 'lodash'
import TableWrapper from '~/components/tables/TableWrapper.vue'
export default {
  components: { TableWrapper },
  props: {
    analysis: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      analyses: [],
      count: 0,
      options: {
        page: 1,
        itemsPerPage: 25,
        sortBy: ['value'],
        sortDesc: [true],
      },
      headers: [
        { text: this.$t('analysisResult.parameter'), value: 'parameter' },
        { text: this.$t('analysisResult.value'), value: 'value' },
        { text: this.$t('analysisResult.valueText'), value: 'value_txt' },
        { text: this.$t('analysisResult.valueError'), value: 'value_error' },
      ],
      queryFields: {
        parameter: () => 'parameter',
        value: () => 'value',
        value_txt: () => 'value_txt',
        value_error: () => 'value_error',
      },
    }
  },
  methods: {
    round,
    async handleUpdate(options) {
      const analysisResponse = await this.$services.sarvSolr.getResourceList(
        'analysis_results',
        {
          ...options,
          isValid: isNil(this.analysis),
          defaultParams: {
            fq: `analysis_id:${this.analysis}`,
          },
          queryFields: this.queryFields,
        }
      )

      this.analyses = analysisResponse.items
      this.count = analysisResponse.count
    },
  },
}
</script>
