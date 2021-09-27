<template>
  <table-wrapper
    v-bind="$attrs"
    :headers="computedHeaders"
    :items="items"
    :options="options"
    :count="count"
    v-on="$listeners"
    @change:headers="$_handleHeadersChange"
  >
    <template #item.analysis_method="{ item }">{{
      $translate({ et: item.analysis_method, en: item.analysis_method_en })
    }}</template>
  </table-wrapper>
</template>

<script>
import { round, cloneDeep } from 'lodash'
import TableWrapper from '~/components/tables/TableWrapper.vue'
import headersMixin from '~/mixins/headersMixin'
import { HEADERS_ANALYSIS_RESULT } from '~/constants'
export default {
  name: 'AnalysisResultTable',
  components: { TableWrapper },
  mixins: [headersMixin],
  props: {
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
    hideDepth: Boolean,
    hideMethod: Boolean,
  },
  data() {
    return {
      localHeaders: cloneDeep(HEADERS_ANALYSIS_RESULT),
    }
  },
  computed: {
    computedHeaders() {
      return this.$_headers.filter((item) => {
        if (item.value.includes('depth')) return !this.hideDepth
        if (item.value === 'analysis_method') return !this.hideMethod
        else return item
      })
    },
  },
  methods: {
    round,
  },
}
</script>
