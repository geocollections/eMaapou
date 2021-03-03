<template>
  <sample-table :search-field="{ key: 'locality_id', value: locality }" />
</template>

<script>
import SampleTable from '@/components/tables/SampleTable'

export default {
  components: { SampleTable },
  props: {
    locality: {
      type: Number,
      default: null,
    },
  },
}
</script>
