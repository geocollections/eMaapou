<template>
  <analysis-table :search-field="{ key: 'locality_id', value: locality }" />
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
  },
}
</script>
