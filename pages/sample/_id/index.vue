<template>
  <analysis-table :search-field="{ key: 'sample_id', value: sample }" />
</template>

<script>
import AnalysisTable from '@/components/tables/AnalysisTable'
export default {
  components: { AnalysisTable },
  props: {
    sample: {
      type: Number,
      default: null,
    },
  },
}
</script>
