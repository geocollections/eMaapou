<template>
  <analysis-table
    :search-field="{ key: 'locality_id', value: computedValue }"
  />
</template>

<script>
import AnalysisTable from '@/components/tables/AnalysisTable'
export default {
  components: { AnalysisTable },
  props: {
    locality: {
      type: Number,
      default: null,
    },
    depthStart: {
      type: Number,
      default: null,
    },
    depthEnd: {
      type: Number,
      default: null,
    },
  },
  computed: {
    computedValue() {
      return `${this.locality} AND (depth:[${this.depthStart} TO ${this.depthEnd}] OR depth_interval:[${this.depthStart} TO ${this.depthEnd}])`
    },
  },
}
</script>
