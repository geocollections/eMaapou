<template>
  <specimen-table :search-field="{ key: 'locality_id', value: locality }" />
</template>

<script>
import SpecimenTable from '@/components/tables/SpecimenTable'

export default {
  components: { SpecimenTable },
  props: {
    locality: {
      type: Number,
      default: null,
    },
  },
}
</script>
