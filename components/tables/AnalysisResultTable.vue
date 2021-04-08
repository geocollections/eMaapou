<template>
  <table-wrapper
    v-bind="{ showSearch }"
    :headers="headers"
    :items="items"
    :options="options"
    :count="count"
    v-on="$listeners"
  >
  </table-wrapper>
</template>

<script>
import { round } from 'lodash'
import TableWrapper from '~/components/tables/TableWrapper.vue'
export default {
  name: 'AnalysisResultTable',
  components: { TableWrapper },
  props: {
    showSearch: {
      type: Boolean,
      default: true,
    },
    items: {
      type: Array,
      default: () => [],
    },
    count: {
      type: Number,
      default: 0,
    },
    options: {
      type: Object,
      default: () => ({
        page: 1,
        itemsPerPage: 25,
        sortBy: [],
        sortDesc: [],
      }),
    },
  },
  data() {
    return {
      headers: [
        { text: this.$t('analysisResult.parameter'), value: 'parameter' },
        { text: this.$t('analysisResult.value'), value: 'value' },
        { text: this.$t('analysisResult.valueText'), value: 'value_txt' },
        { text: this.$t('analysisResult.valueError'), value: 'value_error' },
      ],
    }
  },
  methods: {
    round,
  },
}
</script>
